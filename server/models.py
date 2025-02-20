from datetime import datetime, timezone
from app import db, bcrypt
from sqlalchemy.ext.hybrid import hybrid_property


class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True)
    _password_hash = db.Column(db.String)
    is_verified = db.Column(db.Boolean, default=False)
    is_admin = db.Column(db.Boolean, default=False)
    profile_picture = db.Column(db.String, default='', nullable=True)
    
    records = db.relationship('Record', back_populates='user', cascade='all, delete-orphan', lazy='joined')
    
    @hybrid_property
    def password_hash(self):
        raise AttributeError("Password hashes may not be viewed.")
    
    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "profile_picture": self.profile_picture,
            "is_admin": self.is_admin,
            "is_verified": self.is_verified
        }
        
class Record(db.Model):
    __tablename__ = "records"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # e.g. "red-flag" or "intervention"
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default="under investigation")
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    image_url = db.Column(db.String, nullable=True)  # URL to an image supporting the claim
    video_url = db.Column(db.String, nullable=True)  # URL to a video supporting the claim
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    user = db.relationship("User", backref="records", lazy='joined')

    def to_dict(self):
        return {
            "id": self.id,
            "type": self.type,
            "description": self.description,
            "status": self.status,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "image_url": self.image_url,
            "video_url": self.video_url,
            "created_at": self.created_at.iso_format(),
            "user": {
                "id": self.user.id,
                "username": self.user.name,
                "profile_picture": self.user.profile_picture
            } if self.user else None
        }