from datetime import timedelta
from flask import Flask, make_response, request, session, redirect, url_for
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, decode_token
from flask_dance.contrib.google import make_google_blueprint, google
from sqlalchemy import MetaData
from config import Config

import os

from send_email import send_verification_email
from password_change import password_change
import cloudinary
import cloudinary.uploader

from status import status_change

# Initialize extensions globally
db = SQLAlchemy(metadata=MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
}))

app = Flask(__name__)
app.config.from_object(Config)

bcrypt = Bcrypt(app)

migrate = Migrate(app, db)
cors = CORS(app, supports_credentials=True, origins=["https://ireporter-site.netlify.app", "https://accounts.google.com"])
api = Api(app)

db.init_app(app)

google_bp = make_google_blueprint(
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    scope=["openid", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"],
    redirect_url="/post_google_auth"
)
app.register_blueprint(google_bp, url_prefix="/login")

cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME_FOR_CLOUDINARY"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)
jwt = JWTManager(app)

with app.app_context():
    from models import User, Record, Like, Follow, Comment, Bookmark

class Signup(Resource):
    def post(self):
        data = request.get_json()
        
        print("Received data: ", data)
        user = User(
            username=data.get('username'), 
            email=data.get('email'),
            is_admin=data.get('is_admin')
        )
        user.password_hash = data.get('password')
        
        try:
            db.session.add(user)
            db.session.commit()
            
            token = create_access_token(identity=user.email, expires_delta=timedelta(hours=24))
            status = send_verification_email(user.email, token)
            print("Status == 202?", status)
            if not status:
                return make_response({"Error": "Failed to send verification email"}, 500)
            
            session['user_id'] = user.id
            print(session)
            return make_response(user.to_dict(), 201)
        except Exception as e:
            return make_response({f"Error": "Error signing up. Check credentials.", "e": {e}}, 422)

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


@app.route("/post_google_auth")
def post_google_auth():
    # If not authorized, force a login.
    if not google.authorized:
        return redirect(url_for("google.login"))
    
    # Fetch user info from Google.
    resp = google.get("/oauth2/v2/userinfo")
    if not resp.ok:
        return make_response({"Error": "Failed to fetch user info from Google"}, 400)
    
    user_info = resp.json()
    email = user_info.get("email")
    name = user_info.get("name")
    profile_picture = user_info.get("picture")
    
    # Check if the user already exists.
    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(username=name, email=email, profile_picture=profile_picture)
        user.is_verified = True
        db.session.add(user)
        db.session.commit()
    
    session["user_id"] = user.id
    token = create_access_token(identity=user.email)
    # Redirect to your frontend, passing the token as a query parameter (or handle as desired).
    return redirect(f"https://ireporter-site.netlify.app/?token={token}")

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
            print(session)
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
        print(file)
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
            return {"image_url": image_url}, 200
        except Exception as e:
            app.logger.error(e)
            return {"error": "Profile picture upload failed"}, 500

class ImageUpload(Resource):
    def post(self):
        if "file" not in request.files:
            return make_response({"error": "No file provided"}), 400

        file = request.files["file"]
        print(file)
        try:
            upload_result = cloudinary.uploader.upload(
                file,
                folder="post_images",
                transformation={"width": 800, "height": 600, "crop": "fill"}
            )
            image_url = upload_result.get("secure_url")
            return {"image_url": image_url}, 200
        except Exception as e:
            app.logger.error(e)
            return {"error": "Image upload failed"}, 500

class VideoUpload(Resource):
    def post(self):
        if "file" not in request.files:
            return make_response({"error": "No file provided"}), 400

        file = request.files["file"]
        print(file)
        try:
            upload_result = cloudinary.uploader.upload(
                file,
                folder="post_videos",
                resource_type="auto",
                eager_async=True
            )
            print("Cloudinary upload result:", upload_result)
            video_url = upload_result.get("secure_url")
            return {"video_url": video_url}, 200
        except Exception as e:
            app.logger.error(e)
            return {"error": "Video upload failed"}, 500
        
class Records(Resource):
    def get(self):
        all_records = Record.query.all()
        if all_records:
            return make_response([r.to_dict() for r in all_records], 200)
        return make_response({"message": "No records available."}, 404)
    
    def post(self):
        data = request.get_json()
        print(data)
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
            print(record.to_dict())
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
    def get(self, id):
        record = Record.query.filter_by(id=id).first()
        if record:
            return make_response(record.to_dict(), 200)
        return make_response({"message": "no record found"}, 404)
    
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
        user = User.query.get_or_404(data.get('user_id'))
        record = Record.query.get_or_404(record_id)
        print(user)
        print(record)
        # Check if the user already liked the record
        existing_like = Like.query.filter_by(user_id=user.id, record_id=record.id).first()
        if existing_like:
            return make_response({"message": "You have already liked this record."}, 400)
        
        # Create a new like
        like = Like(user_id=user.id, record_id=record.id)
        db.session.add(like)
        db.session.commit()
        
        # Count the number of likes for this record
        like_count = len(record.likes)

        # Return the like and like count
        return make_response({
            "like": like.to_dict(),
            "like_count": like_count
        }, 201)
        
class GetLikeCount(Resource):
    def get(self, record_id):
        record = Record.query.get_or_404(record_id)
        like_count = Like.query.filter_by(record_id=record.id).count()
        return make_response({"like_count": like_count})
api.add_resource(GetLikeCount, '/like_count/<int:record_id>')

class GetLikeStatus(Resource):
    def get(self, record_id, user_id):
        record = Record.query.get_or_404(record_id)
        user = User.query.get_or_404(user_id)
        like = Like.query.filter_by(record_id=record.id, user_id=user.id).first()
        return make_response({"has_liked": like is not None})
api.add_resource(GetLikeStatus, '/like_status/<int:record_id>/<int:user_id>')

class UnlikeRecord(Resource):
    def post(self, record_id):
        data = request.get_json()
        user = User.query.get_or_404(data.get('user_id'))
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
        user = User.query.get_or_404(data.get('user_id'))
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
    def delete(self, followed_id):
        data = request.get_json()
        user = User.query.get_or_404(data.get('user_id'))
        followed_user = User.query.get_or_404(followed_id)
        
        follow = Follow.query.filter_by(follower_id=user.id, followed_id=followed_user.id).first()
        if not follow:
            return make_response({"message": "You are not following this user."}, 400)
        
        db.session.delete(follow)
        db.session.commit()
        
        return make_response({"message": "Unfollowed successfully."}, 200)
    
class Users(Resource):
    def get(self):
        users = User.query.all()
        if users:
            return make_response([u.to_dict() for u in users], 200)
        return make_response({"Error": "No users"}, 404)

class UserById(Resource):
    def patch(self, id):
        user = User.query.filter_by(id=id).first()
        for attr in request.json:
            setattr(user, attr, request.json[attr])
            
        db.session.add(user)
        db.session.commit()
        
        return make_response(
            user.to_dict(),
            200
        )
        
    def delete(self, id):
        user = User.query.filter_by(id=id).first()
        if user:
            db.session.delete(user)
            db.session.commit()
            return {"Message": "User successfully deleted."}, 204
        return {"Message": "User not found"}, 404
api.add_resource(UserById, "/users/<int:id>")
class NewPasswordRequest(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        user = User.query.filter_by(email=email).first()
        if not user:
            return make_response({"Error": "No user with that email found"}, 404)
        
        token = create_access_token(identity=user.email, expires_delta=timedelta(hours=1))
        print("Reset password token generated:", token)
        
        status = password_change(user.email, token)
        print("SendGrid status (reset email):", status)
        
        if not status:
            return make_response({"Error": "Failed to send reset password email"}, 500)
        
        return make_response({"message": "Reset password email sent"}, 200)
    
class NewPassword(Resource):
    def post(self, token):
        data = request.get_json()
        new_password = data.get("password")
        if not new_password:
            return make_response({"Error": "New password is required"}, 400)
        
        try:
            decoded = decode_token(token)
        except Exception as e:
            print("Token decoding error:", e)
            return make_response({"Error": "Invalid or expired token"}, 400)
        
        email = decoded.get("sub")
        user = User.query.filter_by(email=email).first()
        if not user:
            return make_response({"Error": "User not found"}, 404)
        
        # Update the password (this will hash it via your model setter)
        user.password_hash = new_password
        db.session.commit()
        
        return make_response({"message": "Password reset successfully"}, 200)

class CommentsForRecord(Resource):
    def get(self, record_id):
        all_comments = Comment.query.filter_by(record_id=record_id).all()
        if all_comments:
            return make_response({
                "comments": [c.to_dict() for c in all_comments]}
                ,200)
        return make_response({"message": "No comments available."}, 404)
    
    def post(self, record_id):
        data = request.get_json()
        
        comment = Comment(
            message = data.get('message'),
            user_id = data.get('user_id'),
            record_id = record_id,
            image_url = data.get('image_url'),
            video_url = data.get('video_url')
        )
        
        try:
            db.session.add(comment)
            db.session.commit()
            
            return make_response(comment.to_dict(), 201)
        except Exception:
            return make_response({"Error": "Error making comment."}, 422)
    
    def delete(self, record_id):
        data = request.get_json()
        
        # Retrieve the comment
        comment = Comment.query.filter_by(id=data.get('comment_id'), record_id=record_id, user_id=data.get('user_id')).first()

        # Check if the user is the one who created the comment
        # if comment['user_id'] != request.args.get('user_id', type=int):
        #     return {"message": "You can only delete your own comment."}, 403

        # Delete the comment
        db.session.delete(comment)
        db.session.commit()

        return {"message": "Comment deleted successfully."}, 200
    
api.add_resource(CommentsForRecord, '/comments_for_record/<int:record_id>')
class CommentCountForRecord(Resource): 
    def get(self, record_id):
        all_comments = Comment.query.filter_by(record_id=record_id).all()
        return make_response({"comment_count": len([c.to_dict() for c in all_comments])}, 200)
api.add_resource(CommentCountForRecord, '/comment_count_for_record/<int:record_id>')
class BookmarkMain(Resource):
    def post(self, record_id):
        data = request.get_json()
        bookmark = Bookmark()  # Create a new instance without passing arguments
        
        # Set the fields of the bookmark object
        bookmark.record_id = record_id
        bookmark.user_id = data.get('user_id')
        
        try:
            db.session.add(bookmark)
            db.session.commit()
            return make_response(bookmark.to_dict(), 200)
        except Exception as e:
            return make_response({"Error": "Error making bookmark"}, 422)
    def delete(self, record_id):
        
        data = request.get_json()
        
        bookmark = Bookmark.query.filter_by(user_id=data.get('user_id'), record_id=record_id)
        
        if bookmark.user_id != request.args.get('user_id', type=int):
            return {"message": "You can only delete your own bookmark."}, 403
        db.session.delete(bookmark)
        db.session.commit()
        return {"message": "bookmark deleted successfully"}, 200
api.add_resource(BookmarkMain, '/bookmark/<int:record_id>')

class GetBookmarkStatus(Resource):
    def get(self, record_id, user_id):
        record = Record.query.get_or_404(record_id)
        user = User.query.get_or_404(user_id)
        bookmark = Bookmark.query.filter_by(record_id=record.id, user_id=user.id).first()
        return make_response({"has_bookmarked": bookmark is not None})
api.add_resource(GetBookmarkStatus, '/bookmark_status/<int:record_id>/<int:user_id>')

class AllBookmarks(Resource):
    def get(self):
        data = request.get_json()
        bookmarks = Bookmark.query.filter(user_id=data.get('user_id')).all
        return make_response([b.to_dict for b in bookmarks], 200)
    
api.add_resource(AllBookmarks, '/bookmarks')

class PostStatusUpdate(Resource):
    def post(self):
        post = request.get_json()
        record = Record.query.filter_by(id=post.get('post_id')).first()
        status = status_change(post=record)
        if status:
            return make_response({"message": "update email sent!"}, 201)
        return make_response({"message": "error sending email"}, 422)
api.add_resource(PostStatusUpdate, '/post_status')

api.add_resource(Signup, '/signup')
api.add_resource(Verify, '/verify/<string:token>')
# api.add_resource(GoogleCallback, '/google_callback')
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
api.add_resource(UnlikeRecord, '/unlike_record/<int:record_id>')
api.add_resource(FollowUser, '/follow_user/<int:followed_id>')
api.add_resource(UnfollowUser, '/unfollow_user/<int:followed_id>')
api.add_resource(Users, '/users')
api.add_resource(NewPasswordRequest, '/newpassword')
api.add_resource(NewPassword, '/newpassword/<string:token>')
# print(app.url_map)
if __name__ == '__main__':
    app.run(port=5000, debug=True)
