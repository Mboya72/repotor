from flask import Flask, make_response, request, session
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from config import Config


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
            
            session['user_id'] = user.id
            print(session)
            return make_response(user.to_dict(), 201)
        except Exception:
            return make_response({"Error": "Error signing up. Check credentials."}, 422)
        
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
api.add_resource(CheckSession, '/check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
# print(app.url_map)
if __name__ == '__main__':
    app.run(port=5000, debug=True)
