from .models import Iteration, Conversation, User
from . import db


def get_iterations(conversation_id, user_id):
    return Iteration.query.filter_by(
        conversation_id=conversation_id, user_id=user_id
    ).all()


def add_iteration(
    id, user_id, voice_to_text, interlocutor, corrector, conversation_id, created_at
):
    new_iteration = Iteration(
        id=id,
        user_id=user_id,
        voice_to_text=voice_to_text,
        interlocutor=interlocutor,
        corrector=corrector,
        conversation_id=conversation_id,
        created_at=created_at,
    )

    db.session.add(new_iteration)


def get_conversation(conversation_id):
    return Conversation.query.filter_by(id=conversation_id).first()


def get_conversations(user_id):
    return Conversation.query.filter_by(user_id=user_id).all()


def add_conversation(id, language, title, picture, user_id):
    new_conversation = Conversation(
        id=id,
        language=language,
        title=title,
        picture=picture,
        user_id=user_id,
    )
    db.session.add(new_conversation)
    return new_conversation


def get_user(username):
    return User.query.filter_by(username=username).first()


def add_user(id, username, password):
    new_user = User(
        id=id,
        username=username,
        password=password,
    )
    db.session.add(new_user)
