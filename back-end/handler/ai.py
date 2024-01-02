from flask import Blueprint, request, Response
from flask_login import login_required, current_user
import requests
import json
import os


import uuid
from . import db
import datetime
from .crud import get_conversation, get_iterations, add_iteration
from .services import LanguageProcessing, TextToVoice, ImageGenerator, VoiceToText


ai = Blueprint("ai", __name__)
api_server = os.getenv("AIHUB_URL")


@ai.route("/available_languages")
@login_required
def available_languages():
    if request.method == "GET":
        response = requests.get(f"{api_server}/text_to_voice/azure/available_voices")
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": "Failed to fetch data from FastAPI"}
    return "no get method"


@ai.route("/iteration_end", methods=["POST", "OPTIONS"])
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


@ai.route("/voice_to_text", methods=["POST"])
@login_required
def voice_to_text():
    if request.method == "POST":
        audio_file = request.files["audio"]
        audio_file_size = os.fstat(audio_file.fileno()).st_size
        if audio_file_size <= 0:
            return "audio_file empty"

        response = VoiceToText(url=api_server).request(audio_file=audio_file)

        json_response = response.json()
        # Process the response as needed
        return json_response.get("whisper_result")

    return "no post method", 201


@ai.route("/text_to_voice", methods=["POST"])
def text_to_voice():
    if request.method == "POST":
        data = json.loads(request.data)

        response = TextToVoice(url=api_server).request(
            text=data["text"], language=data["language"]
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
        interlocutor_sections = get_conversation_history(
            conversation_id=conversation_id, user_id=user_id
        )

        interlocutor_sections.append({"role": "user", "content": str(text)})

        response = api_request_language_processing(text, interlocutor_sections)
        print(response, flush=True)
        return response, 200
    return "not a post method"


@ai.route("/summarise_conversation", methods=["POST"])
@login_required
def summarise_conversation():
    user_id = current_user.id
    data = json.loads(request.data)
    conversation_id = data["conversation_id"]
    conversation = get_conversation(conversation_id=conversation_id)

    conversation.title = summarise(conversation.id, user_id)
    conversation.title_updateable = 0

    db.session.commit()
    return {"new_title": conversation.title}


@ai.route("/generate_image", methods=["POST"])
@login_required
def generate_image_for_conversation():
    if request.method == "POST":
        data = json.loads(request.data)
        conversation_id = data.get("conversation_id")
        conversation = get_conversation(conversation_id=conversation_id)

        if conversation:
            description = conversation.title

            picture_name = generate_new_image(description)

            conversation.picture = picture_name
            conversation.picture_updateable = 0
            db.session.commit()

            return {"picture_name": picture_name}
        else:
            return Response(
                f"Conversation with ID {conversation_id} not found", status=404
            )
    return "no post method"


def generate_new_image(description):
    data = ImageGenerator(url=api_server).request(description=description)

    image_data = requests.get(data["url"])
    picture_name = f"image_{uuid.uuid4()}.png"

    relative_path = os.path.join("../back-end/img", picture_name)
    # Convert to an absolute path
    absolute_path = os.path.abspath(relative_path)

    with open(absolute_path, "wb") as f:
        f.write(image_data.content)

    return picture_name  # picture_name


def summarise(conversation_id, user_id):
    sections = get_conversation_history(
        conversation_id=conversation_id, user_id=user_id
    )

    response = request_for_summary(sections)
    print(response, flush=True)
    return response["summarizer"]["content"]


def request_for_summary(sections):
    token = 35

    summarizer = {
        "name": "summarizer",
        "system_message": f"Please summarise the conversation to a title. Use a maximum of {token} tokens for your answer",
        "sections": sections,
    }

    response = LanguageProcessing(url=api_server).request(
        token=token, model="gpt-3.5-turbo", instances=[summarizer]
    )
    return response


def get_conversation_history(conversation_id, user_id):
    iterations = get_iterations(conversation_id=conversation_id, user_id=user_id)
    sections = []

    sorted_iterations = sorted(iterations, key=lambda x: x.created_at)

    for iteration in sorted_iterations:
        sections.append(
            {
                "role": "user",
                "content": f"{iteration.voice_to_text}",
            },
        )
        sections.append(
            {
                "role": "assistant",
                "content": f"{iteration.interlocutor}",
            },
        )
    return sections


def api_request_language_processing(text, interlocutor_sections):
    token = 100

    interlocutor = {
        "name": "interlocutor",
        "system_message": f"Try to have a conversation with the user. That also means asking counter questions from time to time. Keep your answers short. Use a maximum of {token} tokens for your answer",
        "sections": interlocutor_sections,
    }

    corrector = {
        "name": "corrector",
        "system_message": "Correct the grammer of the user",
        "sections": [{"role": "user", "content": text}],
    }

    return LanguageProcessing(api_server).request(
        token=token, model="gpt-3.5-turbo", instances=[interlocutor, corrector]
    )
