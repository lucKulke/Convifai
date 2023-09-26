from flask import Blueprint, request, Response
from flask_login import login_required, current_user
from . import db
from .models import Conversation
import json
import sys
import time

user_data = Blueprint("user_data", __name__)


@user_data.route("/conversation/:id")
@login_required
def conversation():
    return "conversation id"


@user_data.route("/conversations")
@login_required
def conversations():
    user_id = current_user.id
    conversations = Conversation.query.filter_by(user_id=user_id).all()
    response = dict()

    index = 1
    for conversation in conversations:
        response[index] = {
            "id": conversation.id,
            "language": conversation.language,
            "title": conversation.title,
            "picture": conversation.picture,
        }
        index += 1

    print(response, flush=True)
    return response


@user_data.route("/conversations/add", methods=["POST"])
@login_required
def conversation_add():
    user_id = current_user.id
    data = json.loads(request.data)
    language = data["language"]
    title = data["title"]
    picture = data["picture"]

    db.session.add(
        Conversation(language=language, title=title, picture=picture, user_id=user_id)
    )
    db.session.commit()
    return "conversation added"


@user_data.route("/conversations/delete", methods=["POST"])
@login_required
def conversation_delete():
    data = request.form
    conversation_id = data.get("conversation_id")
    conversation_to_delete = Conversation.query.get(conversation_id)

    if conversation_to_delete:
        db.session.delete(conversation_to_delete)
        db.session.commit()
        return Response(f"Conversation with ID {conversation_id} was deleted!")
    else:
        return Response(f"Conversation with ID {conversation_id} not found", status=404)


@user_data.route("/conversations/picture", methods=["POST"])
@login_required
def conversation_picture():
    data = request.form
    conversation_id = data.get("conversation_id")
    conversation = Conversation.query.get(conversation_id)

    if conversation:
        text = conversation.title
        # fetch new picture start
        time.sleep(2)
        picture = "/images/pic6.png"
        # end

        conversation.picture = picture
        db.session.commit()

        return Response(picture, mimetype="text")
    else:
        return Response(f"Conversation with ID {conversation_id} not found", status=404)


@user_data.route("/conversations/title", methods=["POST"])
@login_required
def conversation_title():
    data = request.form
    conversation_id = data.get("conversation_id")
    conversation = Conversation.query.get(conversation_id)

    if conversation:
        # fetch new title start
        time.sleep(2)
        title = "new title"
        # end

        conversation.title = title
        db.session.commit()

        return Response(title, mimetype="text")
    else:
        return Response(f"Conversation with ID {conversation_id} not found", status=404)
