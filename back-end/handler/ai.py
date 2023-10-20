from flask import Blueprint, request, Response
from flask_login import login_required, current_user
import requests
import json
import os
import asyncio
from .models import Iteration, Conversation
import uuid
from . import db
import datetime


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

        conversation = Conversation.query.filter_by(id=data["conversation_id"]).first()
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
        try:
            audio_file = request.files["audio"]
            audio_file_size = os.fstat(audio_file.fileno()).st_size
            if audio_file_size <= 0:
                return "smaller than 0"

            # Check if the 'audio' field exists in the form data
            data = {
                "model": "small",  # Example: You can add other form fields here
            }

            # Create a dictionary with the audio file field, using the field name specified by the API
            files = {"audio_file": ("audio.wav", audio_file)}

            # Make the POST request with form data
            response = requests.post(
                f"http://{api_server}/voice_to_text/whisper?only_text=true",
                data=data,  # Your form fields
                files=files,  # The audio file
            )
            if response.status_code == 200:
                response_text = response.text[1:-1]
                # Process the response as needed
                return response_text
            else:
                # Handle the error response here
                return f"HTTP error! Status: {response.status_code}"
        except Exception as err:
            print(f"error {err}")
            return Response(content=f"error: {str(err)}", status_code=500)
    return "no post method", 201


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
                "system_message": "Try to have a conversation with the user. That also means asking counter questions from time to time. Also Try to keep your answers short.",
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


@ai.route("/summarise_conversation", methods=["POST"])
@login_required
def summarise_conversation():
    user_id = current_user.id
    data = json.loads(request.data)
    conversation_id = data["conversation_id"]
    conversation = Conversation.query.filter_by(
        id=conversation_id, user_id=user_id
    ).first()
    response = []

    conversation.title = summarize_conversation(conversation.id, user_id)
    conversation.title_updateable = 0

    db.session.commit()
    return {"new_title": conversation.title}


def summarize_conversation(conversation_id, user_id):
    iterations = Iteration.query.filter_by(
        conversation_id=conversation_id, user_id=user_id
    ).all()

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

    response = request_language_processing(sections)
    print(response, flush=True)
    return response["summarizer"]["content"]


def request_language_processing(sections):
    payload = {
        "instances": {
            "summarizer": {
                "system_message": "Please summarise the conversation to a title.",
                "sections": sections,
            }
        },
        "model": "gpt-3.5-turbo",
        "token": 50,
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


@ai.route("/generate_image", methods=["POST"])
@login_required
def generate_image_for_conversation():
    if request.method == "POST":
        user_id = current_user.id
        data = json.loads(request.data)
        conversation_id = data.get("conversation_id")
        conversation = Conversation.query.get(conversation_id)

        if conversation:
            description = conversation.title

            picture_name = generate_new_image(description)

            # end

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
    payload = {
        "description": description + ", cartoon style",
        "number_of_pictures": 1,
        "size": "512x512",
    }

    response = requests.post(
        f"http://{api_server}/image_generation/dalle",
        headers={"Content-Type": "application/json"},
        json=payload,
    )

    data = response.json()
    print(data["url"], flush=True)

    image_data = requests.get(data["url"])
    picture_name = f"image_{uuid.uuid4()}.png"

    relative_path = os.path.join("../back-end/img", picture_name)
    # Convert to an absolute path
    absolute_path = os.path.abspath(relative_path)

    with open(absolute_path, "wb") as f:
        f.write(image_data.content)

    return picture_name  # picture_name
