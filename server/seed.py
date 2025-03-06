from app import app, db
from models import User, Follow
with app.app_context():
    Follow.query.delete()
    db.session.commit()