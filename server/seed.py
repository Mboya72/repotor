from app import app, db
from models import User
with app.app_context():
    User.query.delete()
    db.session.commit()