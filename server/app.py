from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from config import Config

# Initialize extensions globally
db = SQLAlchemy(metadata=MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
}))
bcrypt = Bcrypt()
migrate = Migrate()
cors = CORS()
api = Api()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Link extensions to app
    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, supports_credentials=True)
    api.init_app(app)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(port=5000, debug=True)
