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

with app.app_context():
    from models import User

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
    
api.add_resource(Signup, '/signup')
api.add_resource(Verify, '/verify/<string:token>')
api.add_resource(GoogleCallback, '/google_callback')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')

# print(app.url_map)
if __name__ == '__main__':
    app.run(port=5000, debug=True)
