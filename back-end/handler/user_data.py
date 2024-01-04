from flask import Blueprint, request, Response
from flask_login import login_required, current_user
from . import db
import json
import datetime

from flask import jsonify
import uuid
import requests
import os
from .crud import (
    add_conversation,
    get_conversations,
    get_conversation,
    get_iterations,
    add_iteration,
)


api_server = os.getenv("AIHUB")

user_data = Blueprint("user_data", __name__)


@user_data.route("/conversation/<string:id_>")
@login_required
def conversation(id_):
    if request.method == "GET":
        user_id = current_user.id  # current_user.id
        conversation_id = id_

        interations = get_iterations(conversation_id=conversation_id, user_id=user_id)

        conversation = get_conversation(conversation_id=conversation_id)

        response = {}
        history = []

        for iteration in interations:
            history.append(
                {
                    "user": iteration.voice_to_text,
                    "interlocutor": iteration.interlocutor,
                    "corrector": iteration.corrector,
                },
            )

        response["history"] = history
        response["language"] = conversation.language
        if not response:
            return jsonify([]), 201
        else:
            return jsonify(response), 200
    return "no get method"


@user_data.route("/conversations")
@login_required
def conversations():
    if request.method == "GET":
        user_id = current_user.id
        conversations = get_conversations(user_id=user_id)
        response = []
        sorted_conversations = sorted(conversations, key=lambda x: x.created_at)

        for conversation in sorted_conversations:
            response.append(
                {
                    "id": conversation.id,
                    "language": conversation.language,
                    "title": conversation.title,
                    "title_updateable": conversation.title_updateable,
                    "picture": conversation.picture,
                    "picture_updateable": conversation.picture_updateable,
                }
            )

        print(response, flush=True)
        if not response:
            return jsonify([]), 201
        else:
            return jsonify(response), 200
    return "no get method"


@user_data.route("/conversations/add", methods=["POST"])
@login_required
def conversation_add():
    if request.method == "POST":
        user_id = current_user.id
        data = json.loads(request.data)
        language = data["language"]
        title = data["title"]
        picture = data["picture"]

        new_conversation = add_conversation(
            id=uuid.uuid4(),
            language=language,
            title=title,
            picture=picture,
            user_id=user_id,
            created_at=datetime.datetime.now(),
        )

        db.session.commit()
        return jsonify({"id": str(new_conversation.id)}), 201
    return "no post method"


@user_data.route("/conversations/delete", methods=["POST"])
@login_required
def conversation_delete():
    if request.method == "POST":
        data = json.loads(request.data)
        conversation_id = data.get("id")
        conversation_to_delete = get_conversation(conversation_id=conversation_id)

        if conversation_to_delete:
            db.session.delete(conversation_to_delete)
            db.session.commit()
            return Response(
                f"Conversation with ID {conversation_id} was deleted!", status=201
            )
        else:
            return Response(
                f"Conversation with ID {conversation_id} not found", status=404
            )
    return "no post method"


@user_data.route("/iteration_end", methods=["POST", "OPTIONS"])
@login_required
def save_iteration_data():
    if request.method == "POST":
        data = json.loads(request.data)
        conversation_id = data["conversation_id"]

        add_iteration(
            id=uuid.uuid4(),
            user_id=current_user.id,
            voice_to_text=data["user"],
            interlocutor=data["interlocutor"],
            corrector=data["corrector"],
            conversation_id=conversation_id,
            created_at=datetime.datetime.now(),
        )

        conversation = get_conversation(conversation_id)
        if conversation:
            conversation.title_updateable = 1
            conversation.picture_updateable = 1

        db.session.commit()

        return "iteration data saved", 200
    return "not a post method"
