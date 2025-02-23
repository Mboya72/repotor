from datetime import datetime, timezone
from sqlalchemy import UniqueConstraint
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
    
    # Relationship: use back_populates to match the relationship in Record
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
    type = db.Column(db.String(50), nullable=False)  # e.g., "red-flag" or "intervention"
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default="under investigation")
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    image_url = db.Column(db.String, nullable=True)  # URL to an image supporting the claim
    video_url = db.Column(db.String, nullable=True)  # URL to a video supporting the claim
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    # Use back_populates to avoid conflicts with User.records
    user = db.relationship("User", back_populates="records", lazy='joined')

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
            "created_at": self.created_at.isoformat(),  # use isoformat(), not iso_format()
            "user": {
                "id": self.user.id,
                "username": self.user.username,  # changed from name to username
                "profile_picture": self.user.profile_picture
            } if self.user else None
        }
        
class Like(db.Model):
    __tablename__ = "likes"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    record_id = db.Column(db.Integer, db.ForeignKey("records.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    # Ensure a user can only like a record once
    __table_args__ = (UniqueConstraint('user_id', 'record_id', name='_user_record_uc'),)

    user = db.relationship('User', backref=db.backref('likes', lazy='dynamic'))
    record = db.relationship('Record', backref=db.backref('likes', lazy='dynamic'))

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "record_id": self.record_id,
            "created_at": self.created_at.isoformat(),  # corrected
        }

class Follow(db.Model):
    __tablename__ = "follows"

    id = db.Column(db.Integer, primary_key=True)
    follower_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    followed_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    __table_args__ = (UniqueConstraint('follower_id', 'followed_id', name='_follower_followed_uc'),)

    follower = db.relationship('User', foreign_keys=[follower_id], backref=db.backref('following', lazy='dynamic'))
    followed = db.relationship('User', foreign_keys=[followed_id], backref=db.backref('followers', lazy='dynamic'))

    def to_dict(self):
        return {
            "id": self.id,
            "follower_id": self.follower_id,
            "followed_id": self.followed_id,
            "created_at": self.created_at.isoformat(),  # corrected
        }

# class Comment(db.Model):
#     __tablename__ = 'comments'
    
#     id = db.Column(db.Integer, primary_key=True)
    