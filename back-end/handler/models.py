from flask_login import UserMixin
from . import db
import uuid


class User(UserMixin, db.Model):
    id = db.Column(
        db.String(36),
        primary_key=True,
        unique=True,
        nullable=False,
    )
    username = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    conversations = db.relationship("Conversation")


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
    user_id = db.Column(db.String(36), db.ForeignKey("user.id"))
    iterations = db.relationship("Iteration")


class Iteration(db.Model):
    id = db.Column(
        db.String(36),
        primary_key=True,
        unique=True,
        nullable=False,
    )
    user_audio_key = db.Column(db.String(500))
    voice_to_text = db.Column(db.String(500))
    interlocutor = db.Column(db.String(500))
    corrector = db.Column(db.String(500))
    conversation_id = db.Column(db.String(36), db.ForeignKey("conversation.id"))
