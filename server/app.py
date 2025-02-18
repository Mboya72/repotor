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

class Signup(Resource):
    def post(self):
        pass
        # data = request.get_json()
        
        # print("Received data: ", data)
        # user = User(
        #     username=data.get('username'), 
        #     email=data.get('email')
        # )
        # user.password_hash = data.get('password')
        
        # try:
        #     db.session.add(user)
        #     db.session.commit()
            
        #     session['user_id'] = user.id
        #     print(session)
        #     return make_response(user.to_dict(), 201)
        # except Exception:
        #     return make_response({"Error": "Error signing up. Check credentials."}, 422)
        
        

api.add_resource(Signup, '/signup')

# print(app.url_map)
if __name__ == '__main__':
    app.run(port=5000, debug=True)
