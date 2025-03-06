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
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    
    records = db.relationship('Record', back_populates='user', cascade='all, delete-orphan', passive_deletes=True)
    
    # Define a two-way relationship for likes
    likes = db.relationship("Like", back_populates="user", cascade="all, delete-orphan", passive_deletes=True)
    comments = db.relationship("Comment", back_populates="user", cascade="all, delete-orphan", passive_deletes=True)
    bookmarks = db.relationship("Bookmark", back_populates="user", cascade="all, delete-orphan", passive_deletes=True)
    # For follows, define two separate relationships
    following = db.relationship("Follow", foreign_keys="[Follow.follower_id]", 
                                  back_populates="follower", cascade="all, delete-orphan", passive_deletes=True)
    followers = db.relationship("Follow", foreign_keys="[Follow.followed_id]", 
                                  back_populates="followed", cascade="all, delete-orphan", passive_deletes=True)
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
            "is_verified": self.is_verified,
            "created_at": self.created_at.isoformat(),
            "following": [f.to_dict() for f in self.following],
            "followers": [f.to_dict() for f in self.followers],
            "bookmarks": [b.to_dict() for b in self.bookmarks]
        }

        
class Record(db.Model):
    __tablename__ = "records"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), nullable=True)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    image_url = db.Column(db.String, nullable=True)
    video_url = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    user = db.relationship("User", back_populates="records", passive_deletes=True)
    likes = db.relationship("Like", back_populates="record", passive_deletes=True)  # if needed
    comments = db.relationship("Comment", back_populates="record", cascade="all, delete-orphan", lazy="dynamic")
    bookmarks = db.relationship("Bookmark", back_populates="record", cascade="all, delete-orphan", lazy="dynamic")

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
            "created_at": self.created_at.isoformat(),
            "user": {
                "id": self.user.id,
                "username": self.user.username,
                "profile_picture": self.user.profile_picture,
                "email": self.user.email
            } if self.user else None,
            "likes": [l.to_dict() for l in self.likes]
        }

class Like(db.Model):
    __tablename__ = "likes"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    record_id = db.Column(db.Integer, db.ForeignKey("records.id", ondelete="CASCADE"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    __table_args__ = (UniqueConstraint('user_id', 'record_id', name='_user_record_uc'),)

    # Use back_populates to define the two-way relationship
    user = db.relationship("User", back_populates="likes", passive_deletes=True)
    record = db.relationship("Record", back_populates="likes", passive_deletes=True)  # adjust lazy as needed

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "record_id": self.record_id,
            "created_at": self.created_at.isoformat(),
        }

class Follow(db.Model):
    __tablename__ = "follows"

    id = db.Column(db.Integer, primary_key=True)
    follower_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    followed_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    __table_args__ = (UniqueConstraint('follower_id', 'followed_id', name='_follower_followed_uc'),)

    follower = db.relationship("User", foreign_keys=[follower_id], back_populates="following", passive_deletes=True)
    followed = db.relationship("User", foreign_keys=[followed_id], back_populates="followers", passive_deletes=True)

    def to_dict(self):
        return {
            "id": self.id,
            "follower_id": self.follower_id,
            "followed_id": self.followed_id,
            "created_at": self.created_at.isoformat(),  # corrected
        }

class Comment(db.Model):
    __tablename__ = 'comments'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    record_id = db.Column(db.Integer, db.ForeignKey("records.id", ondelete="CASCADE"), nullable=False)
    message = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String, nullable=True)  # URL for an image in the comment
    video_url = db.Column(db.String, nullable=True)  # URL for a video in the comment
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    # Define relationships to the User and Record
    user = db.relationship("User", back_populates="comments", passive_deletes=True)
    record = db.relationship("Record", back_populates="comments", passive_deletes=True)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "record_id": self.record_id,
            "message": self.message,
            "image_url": self.image_url,
            "video_url": self.video_url,
            "created_at": self.created_at.isoformat(),  # Format the datetime
            "user": {
                "id": self.user.id,
                "username": self.user.username,  # User's username
                "profile_picture": self.user.profile_picture
            } if self.user else None,
            "record": {
                "id": self.record.id,
                "type": self.record.type,
                "description": self.record.description,
                "status": self.record.status,
                "created_at": self.record.created_at.isoformat()  # Include basic post info
            } if self.record else None
        }

class Bookmark(db.Model):
    __tablename__ = 'bookmarks'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    record_id = db.Column(db.Integer, db.ForeignKey("records.id", ondelete="CASCADE"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    # Ensure a user can bookmark a record only once
    __table_args__ = (UniqueConstraint('user_id', 'record_id', name='_user_record_uc_bookmarks'),)

    user = db.relationship("User", back_populates="bookmarks", passive_deletes=True)
    record = db.relationship("Record", back_populates="bookmarks", passive_deletes=True)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "record_id": self.record_id,
            "created_at": self.created_at.isoformat(),
        }
