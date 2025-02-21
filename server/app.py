from datetime import timedelta
from flask import Flask, make_response, request, session, redirect, url_for
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import create_access_token, decode_token
from flask_dance.contrib.google import make_google_blueprint, google
from sqlalchemy import MetaData
from config import Config

import os

from send_email import send_verification_email
import cloudinary
import cloudinary.uploader

# Initialize extensions globally
db = SQLAlchemy(metadata=MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
}))

app = Flask(__name__)
app.config.from_object(Config)

bcrypt = Bcrypt(app)

migrate = Migrate(app, db)
cors = CORS(app, supports_credentials=True)
api = Api(app)

db.init_app(app)

google_bp = make_google_blueprint(
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    scope=["profile", "email"],
    redirect_url="/google_callback"
)
app.register_blueprint(google_bp, url_prefix="/login")

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

with app.app_context():
    from models import User, Record, Like, Follow

class Signup(Resource):
    def post(self):
        data = request.get_json()
        
        print("Received data: ", data)
        user = User(
            username=data.get('username'), 
            email=data.get('email')
        )
        user.password_hash = data.get('password')
        
        try:
            db.session.add(user)
            db.session.commit()
            
            token = create_access_token(identity=user.email, expires_delta=timedelta(hours=24))
            if not send_verification_email(user.email, token):
                return make_response({"Error": "Failed to send verification email"}, 500)
            
            session['user_id'] = user.id
            print(session)
            return make_response(user.to_dict(), 201)
        except Exception:
            return make_response({"Error": "Error signing up. Check credentials."}, 422)

class Verify(Resource):
    def get(self, token):
        try:
            decoded = decode_token(token)
            if decoded is None:
                return make_response({"Error": "Invalid or expired token"}, 400)
            email = decoded.get('sub')
            user = User.query.filter_by(email=email).first()
            if not user:
                return make_response({"Error": "Invalid token"}, 400)
            user.is_verified = True
            db.session.commit()
            return make_response({"message": "Email verified successfully!"}, 200)
        except Exception as e:
            print("Verification error:", e)
            return make_response({"Error": "Verification failed"}, 400)

class GoogleCallback(Resource):
    def get(self):
        # If not authorized, redirect to the Google login page
        if not google.authorized:
            return redirect(url_for("google.login"))
        
        resp = google.get("/oauth2/v2/userinfo")
        if not resp.ok:
            return make_response({"Error": "Failed to fetch user info from Google"}, 400)
        
        user_info = resp.json()
        email = user_info.get("email")
        name = user_info.get("name")
        profile_picture = user_info.get("picture")
        
        # Check if the user already exists
        user = User.query.filter_by(email=email).first()
        if not user:
            # Create new user with Google info and mark as verified
            user = User(username=name, email=email, profile_picture=profile_picture)
            # For Google signup, you might not need a password; set a dummy value if required
            user.password_hash = "google_oauth_dummy"
            user.is_verified = True
            db.session.add(user)
            db.session.commit()
        
        session["user_id"] = user.id
        token = create_access_token(identity=user.email)
        return make_response({"token": token, "message": "Logged in with Google"}, 200)

class CheckSession(Resource):
    def get(self):
        print(session)
        if session.get('user_id'):
            return User.query.filter_by(id=session['user_id']).first().to_dict(), 200
        return {"Error message": "401 Unauthorized"}, 401
    
class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter(User.email==data.get('email')).first()
        if user and user.authenticate(data.get('password')):
            session['user_id'] = user.id
            return user.to_dict(), 200    
        return {"Error": "401 Unauthorized"}, 401

class Logout(Resource):
    def delete(self):
        if session['user_id']:
            session.pop('user_id', None)
            return {}, 204
        return {"Error": "401 Unauthorized"}, 401
    
class ProfileUpload(Resource):
    def post(self):
        if "file" not in request.files:
            return make_response({"error": "No file provided"}), 400

        file = request.files["file"]
        try:
            upload_result = cloudinary.uploader.upload(
                file,
                folder="profile_pictures",
                transformation={"width": 400, "height": 400, "crop": "fill", "gravity": "face"}
            )
            image_url = upload_result.get("secure_url")
            user = User.query.filter_by(id=session['user_id']).first()
            user.profile_picture = image_url
            db.session.commit()
            return make_response({"image_url": image_url}), 200
        except Exception as e:
            app.logger.error(e)
            return make_response({"error": "Profile picture upload failed"}), 500

class ImageUpload(Resource):
    def post(self):
        if "file" not in request.files:
            return make_response({"error": "No file provided"}), 400

        file = request.files["file"]
        try:
            upload_result = cloudinary.uploader.upload(
                file,
                folder="post_images",
                transformation={"width": 800, "height": 600, "crop": "fill"}
            )
            image_url = upload_result.get("secure_url")
            return make_response({"image_url": image_url}), 200
        except Exception as e:
            app.logger.error(e)
            return make_response({"error": "Image upload failed"}), 500

class VideoUpload(Resource):
    def post(self):
        if "file" not in request.files:
            return make_response({"error": "No file provided"}), 400

        file = request.files["file"]
        try:
            upload_result = cloudinary.uploader.upload(
                file,
                folder="post_videos",
                resource_type="video"
            )
            video_url = upload_result.get("secure_url")
            return make_response({"video_url": video_url}), 200
        except Exception as e:
            app.logger.error(e)
            return make_response({"error": "Video upload failed"}), 500
        
class Records(Resource):
    def get(self):
        all_records = Record.query.all()
        if all_records:
            return make_response([r.to_dict() for r in all_records], 200)
        return make_response({"message": "No records available."}, 404)
    
    def post(self):
        data = request.get_json()
        
        record = Record(
            type = data.get('type'),
            description = data.get('description'),
            user_id = data.get('user_id'),
            latitude = data.get('latitude'),
            longitude = data.get('longitude'),
            image_url = data.get('image_url'),
            video_url = data.get('video_url')
        )
        
        try:
            db.session.add(record)
            db.session.commit()
            
            return make_response(record.to_dict(), 201)
        except Exception:
            return make_response({"Error": "Error making review."}, 422)

class UserRecords(Resource):
    def get(self, user_id):
        user_records = Record.query.filter(Record.user_id==user_id).all()
        if user_records:
            return make_response([r.to_dict() for r in user_records], 200)
        return {"Error": "User records not found"}, 404

class RecordById(Resource):
    def patch(self, id):
        record = Record.query.filter_by(id=id).first()
        for attr in request.json:
            setattr(record, attr, request.json[attr])
            
        db.session.add(record)
        db.session.commit()
        
        return make_response(
            record.to_dict(),
            200
        )
        
    def delete(self, id):
        record = Record.query.filter_by(id=id).first()
        db.session.delete(record)
        db.session.commit()
        return make_response({"Message": "Successfully deleted record."}, 204)
    
class LikeRecord(Resource):
    def post(self, record_id):
        data = request.get_json()
        user = User.query.get_or_404(session.get('user_id'))
        record = Record.query.get_or_404(record_id)
        
        # Check if the user already liked the record
        existing_like = Like.query.filter_by(user_id=user.id, record_id=record.id).first()
        if existing_like:
            return make_response({"message": "You have already liked this record."}, 400)
        
        # Create a new like
        like = Like(user_id=user.id, record_id=record.id)
        db.session.add(like)
        db.session.commit()
        
        return make_response(like.to_dict(), 201)

class UnlikeRecord(Resource):
    def post(self, record_id):
        data = request.get_json()
        user = User.query.get_or_404(session.get('user_id'))
        record = Record.query.get_or_404(record_id)
        
        # Check if the user has liked the record
        like = Like.query.filter_by(user_id=user.id, record_id=record.id).first()
        if not like:
            return make_response({"message": "You have not liked this record."}, 400)
        
        db.session.delete(like)
        db.session.commit()
        
        return make_response({"message": "Like removed successfully."}, 200)
    
class FollowUser(Resource):
    def post(self, followed_id):
        data = request.get_json()
        user = User.query.get_or_404(session.get('user_id'))
        followed_user = User.query.get_or_404(followed_id)
        
        # Prevent the user from following themselves
        if user.id == followed_user.id:
            return make_response({"message": "You cannot follow yourself."}, 400)
        
        # Check if already following
        existing_follow = Follow.query.filter_by(follower_id=user.id, followed_id=followed_user.id).first()
        if existing_follow:
            return make_response({"message": "You are already following this user."}, 400)
        
        follow = Follow(follower_id=user.id, followed_id=followed_user.id)
        db.session.add(follow)
        db.session.commit()
        
        return make_response(follow.to_dict(), 201)
    
class UnfollowUser(Resource):
    def post(self, followed_id):
        data = request.get_json()
        user = User.query.get_or_404(session.get('user_id'))
        followed_user = User.query.get_or_404(followed_id)
        
        follow = Follow.query.filter_by(follower_id=user.id, followed_id=followed_user.id).first()
        if not follow:
            return make_response({"message": "You are not following this user."}, 400)
        
        db.session.delete(follow)
        db.session.commit()
        
        return make_response({"message": "Unfollowed successfully."}, 200)
api.add_resource(Signup, '/signup')
api.add_resource(Verify, '/verify/<string:token>')
api.add_resource(GoogleCallback, '/google_callback')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(ProfileUpload, '/profile_upload')
api.add_resource(ImageUpload, '/image_upload')
api.add_resource(VideoUpload, '/video_upload')
api.add_resource(Records, '/records')
api.add_resource(UserRecords, '/user_records/<int:id>')
api.add_resource(RecordById, '/record/<int:id>')
api.add_resource(LikeRecord, '/like_record/<int:record_id>')
api.add_resource(UnlikeRecord, 'unlike_record/<int:record_id>')
api.add_resource(FollowUser, '/follow_user/<int:followed_id>')
api.add_resource(UnfollowUser, '/unfollow_user/<int:followed_id>')
# print(app.url_map)
if __name__ == '__main__':
    app.run(port=5000, debug=True)
