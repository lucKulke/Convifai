from flask import Blueprint, request, Response
from flask_login import login_required, current_user
import requests
import json
import os
import asyncio
from .models import Iteration


ai = Blueprint("ai", __name__)
api_server = os.getenv("AIHUB")


@ai.route("/available_languages")
@login_required
def available_languages():
    response = requests.get(f"http://{api_server}/text_to_voice/azure/available_voices")
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Failed to fetch data from FastAPI"}


@ai.route("/iteration_end", methods=["POST"])
@login_required
def save_iteration_data():
    user_id = current_user.user_id
    data = json.loads(request.data)


@ai.route("/voice_to_text")
@login_required
def voice_to_text():
    return "where lives the oldest person in the world"


@ai.route("/text_to_voice", methods=["POST"])
def text_to_voice():
    data = json.loads(request.data)

    payload = {"text": data["text"], "language": data["language"]}
    response = requests.post(
        f"http://{api_server}/text_to_voice/azure",
        data=json.dumps(payload),
        stream=True,
    )
    if response.status_code == 200:
        return Response(
            response.iter_content(chunk_size=1024),
            headers={"Content-type": "audio/wav"},
        )
    else:
        return Response(
            {"detail": f"api status response: {response.status_code}"},
            status=response.status_code,
        )


@ai.route("/language_processing", methods=["POST"])
def language_processing():
    user_id = "70eb0f89-2c17-4107-8106-7765625c0e69"  # current_user.user_id
    data = json.loads(request.data)
    text = data["text"]
    conversation_id = data["conversation_id"]

    interations = Iteration.query.filter_by(
        conversation_id=conversation_id, user_id=user_id
    ).all()

    interlocutor_sections = []

    for iteration in interations:
        interlocutor_sections.insert(
            0,
            {
                "role": "assistant",
                "content": iteration.interlocutor,
            },
        )
        interlocutor_sections.insert(
            0,
            {
                "role": "user",
                "content": iteration.voice_to_text,
            },
        )

    interlocutor_sections.append({"role": "user", "content": text})

    print(interlocutor_sections, flush=True)

    response = api_request_language_processing(text, interlocutor_sections)

    return response


def api_request_language_processing(text, interlocutor_sections):
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

    response = requests.post(
        f"http://{api_server}/language_processing/chat_gpt", data=json.dumps(payload)
    )
    if response.status_code == 200:
        return response.json()
    else:
        return Response(
            {"detail": f"api status response: {response.status_code}"},
            status=response.status_code,
        )
