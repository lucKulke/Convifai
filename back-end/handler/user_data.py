from flask import Blueprint, request, Response
from flask_login import login_required, current_user
from . import db
from .models import Conversation, Iteration
import json
import sys
import time
from flask import jsonify
import uuid

user_data = Blueprint("user_data", __name__)


@user_data.route("/conversation/<string:id_>")
@login_required
def conversation(id_):
    user_id = current_user.id  # current_user.id
    conversation_id = id_

    interations = Iteration.query.filter_by(
        conversation_id=conversation_id, user_id=user_id
    ).all()

    response = []

    for iteration in interations:
        response.append(
            {
                "user": iteration.voice_to_text,
                "interlocutor": iteration.interlocutor,
                "corrector": "iteration.corrector",
            },
        )

    if not response:
        return jsonify([]), 201
    else:
        return jsonify(response), 200


@user_data.route("/conversations")
@login_required
def conversations():
    user_id = current_user.id
    conversations = Conversation.query.filter_by(user_id=user_id).all()
    response = []

    for conversation in conversations:
        response.append(
            {
                "id": conversation.id,
                "language": conversation.language,
                "title": conversation.title,
                "picture": conversation.picture,
            }
        )

    print(response, flush=True)
    if not response:
        return jsonify([]), 201
    else:
        return jsonify(response), 200


@user_data.route("/conversations/add", methods=["POST"])
@login_required
def conversation_add():
    user_id = current_user.id
    data = json.loads(request.data)
    language = data["language"]
    title = data["title"]
    picture = data["picture"]

    new_conversation = Conversation(
        id=uuid.uuid4(),
        language=language,
        title=title,
        picture=picture,
        user_id=user_id,
    )
    db.session.add(new_conversation)
    db.session.commit()
    return jsonify({"id": str(new_conversation.id)}), 201


@user_data.route("/conversations/delete", methods=["POST"])
@login_required
def conversation_delete():
    data = json.loads(request.data)
    conversation_id = data.get("id")
    conversation_to_delete = Conversation.query.get(conversation_id)

    if conversation_to_delete:
        db.session.delete(conversation_to_delete)
        db.session.commit()
        return Response(
            f"Conversation with ID {conversation_id} was deleted!", status=201
        )
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
