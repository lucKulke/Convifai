from flask_login import UserMixin
from . import db
import uuid


class Users(UserMixin, db.Model):
    id = db.Column(
        db.String(36),
        primary_key=True,
        unique=True,
        nullable=False,
    )
    username = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))


class Conversation(db.Model):
    id = db.Column(
        db.String(36),
        primary_key=True,
        unique=True,
        nullable=False,
    )
    language = db.Column(db.String(150))
    title = db.Column(db.String(150))
    picture = db.Column(db.String(150))
    picture_updateable = db.Column(db.Integer)
    title_updateable = db.Column(db.Integer)
    user_id = db.Column(db.String(36))
    created_at = db.Column(db.DateTime)


class Iteration(db.Model):
    id = db.Column(db.String(36), primary_key=True, unique=True)
    user_id = db.Column(db.String(36))
    user_audio_key = db.Column(db.String(500))
    voice_to_text = db.Column(db.String(1000))
    interlocutor = db.Column(db.String(1000))
    corrector = db.Column(db.String(1000))
    conversation_id = db.Column(db.String(36))
    created_at = db.Column(db.DateTime)
