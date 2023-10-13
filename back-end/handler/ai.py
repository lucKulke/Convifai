from flask import Blueprint, request, Response
from flask_login import login_required, current_user
import requests
import json
import os
import asyncio
from .models import Iteration
import uuid
from . import db
import datetime
from sqlalchemy import desc


ai = Blueprint("ai", __name__)
api_server = os.getenv("AIHUB")


@ai.route("/available_languages")
@login_required
def available_languages():
    if request.method == "GET":
        response = requests.get(
            f"http://{api_server}/text_to_voice/azure/available_voices"
        )
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": "Failed to fetch data from FastAPI"}
    return "no get method"


@ai.route("/iteration_end", methods=["POST", "OPTIONS"])
@login_required
def save_iteration_data():
    if request.method == "POST":
        user_id = current_user.id
        data = json.loads(request.data)

        new_iteration = Iteration(
            id=uuid.uuid4(),
            user_id=current_user.id,
            voice_to_text=data["user"],
            interlocutor=data["interlocutor"],
            corrector=data["corrector"],
            conversation_id=data["conversation_id"],
            created_at=datetime.datetime.now(),
        )

        db.session.add(new_iteration)
        db.session.commit()

        return "iteration data saved", 200
    return "not a post method"


@ai.route("/voice_to_text", methods=["POST"])
@login_required
def voice_to_text():
    if request.method == "POST":
        return "Hey how are you?"
    return "no post method"


@ai.route("/text_to_voice", methods=["POST"])
def text_to_voice():
    if request.method == "POST":
        data = json.loads(request.data)

        payload = {"text": data["text"], "language": data["language"]}
        response = requests.post(
            f"http://{api_server}/text_to_voice/azure",
            data=json.dumps(payload),
            stream=True,
        )
        if response.status_code == 200:

            def generate():
                for chunk in response.iter_content(chunk_size=1024):
                    yield chunk

                response.close()  # Close the response to release resources

            return Response(
                generate(),
                content_type="audio/wav",
            )
        else:
            return Response(
                {"detail": f"api status response: {response.status_code}"},
                status=response.status_code,
            )
    return "not a post method"


@ai.route("/language_processing", methods=["POST"])
def language_processing():
    if request.method == "POST":
        user_id = current_user.id
        data = json.loads(request.data)
        text = data["text"]
        conversation_id = data["conversation_id"]
        iterations = Iteration.query.filter_by(
            conversation_id=conversation_id, user_id=user_id
        ).all()

        interlocutor_sections = []

        sorted_iterations = sorted(iterations, key=lambda x: x.created_at)

        for iteration in sorted_iterations:
            interlocutor_sections.append(
                {
                    "role": "user",
                    "content": f"{iteration.voice_to_text}",
                },
            )
            interlocutor_sections.append(
                {
                    "role": "assistant",
                    "content": f"{iteration.interlocutor}",
                },
            )

        interlocutor_sections.append({"role": "user", "content": str(text)})

        response = api_request_language_processing(text, interlocutor_sections)
        print(response, flush=True)
        return response, 200
    return "not a post method"


def api_request_language_processing(text, interlocutor_sections):
    print("only one request gpt!", flush=True)
    payload = {
        "instances": {
            "interlocutor": {
                "system_message": "Try to have a conversation with the user.",
                "sections": interlocutor_sections,
            },
            "corrector": {
                "system_message": "Correct the grammer of the user",
                "sections": [{"role": "user", "content": text}],
            },
        },
        "model": "gpt-3.5-turbo",
        "token": 100,
    }

    payload = json.dumps(payload)
    print(payload, flush=True)
    response = requests.post(
        f"http://{api_server}/language_processing/chat_gpt",
        headers={"Content-Type": "application/json"},
        data=payload,
    )
    if response.status_code == 200:
        return response.json()
    else:
        "error"
