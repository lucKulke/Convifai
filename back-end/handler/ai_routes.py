from flask import Blueprint, request, Response
from flask_login import login_required, current_user
import requests
import json
import os, io
import tempfile


import uuid
from . import db
from .crud import get_conversation, get_iterations
from .services import (
    LanguageProcessor,
    VoiceGenerator,
    ImageGenerator,
    SpeechRecogniser,
)
from .utilitys import AWS_S3

from config import CONFIG


ai_routes = Blueprint("ai_routes", __name__)
aws_s3 = AWS_S3(
    region=os.getenv("AWS_BUCKET_REGION"),
    bucket_name=os.getenv("AWS_BUCKET_NAME"),
    signature_version="v4",
    retries={"max_attempts": 10, "mode": "standard"},
)
api_server_url = os.getenv("AIHUB_URL")
voice_generator = VoiceGenerator(url=api_server_url)
speech_recogniser = SpeechRecogniser(url=api_server_url)
image_generator = ImageGenerator(url=api_server_url)
language_processor = LanguageProcessor(api_server_url)


@ai_routes.route("/available_languages")
@login_required
def available_languages():
    response = requests.get(f"{api_server_url}/text_to_voice/azure/available_languages")
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Failed to fetch data from FastAPI"}


@ai_routes.route("/voice_to_text", methods=["POST"])
@login_required
def voice_to_text():
    audio_file = request.files["audio"]
    audio_file_size = os.fstat(audio_file.fileno()).st_size
    if audio_file_size <= 0:
        return "audio_file empty"

    response = speech_recogniser.request(audio_file=audio_file)

    json_response = response.json()

    return json_response.get("whisper_result")


@ai_routes.route("/text_to_voice", methods=["POST"])
@login_required
def text_to_voice():
    data = json.loads(request.data)

    response = voice_generator.request(text=data["text"], language=data["language"])
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


@ai_routes.route("/language_processing", methods=["POST"])
@login_required
def language_processing():
    user_id = current_user.id
    data = json.loads(request.data)
    text = data["text"]
    conversation_id = data["conversation_id"]
    language = data["language"]
    interlocutor_sections = get_conversation_history(
        conversation_id=conversation_id, user_id=user_id
    )
    db.session.commit()

    interlocutor_sections.append({"role": "user", "content": str(text)})

    response = api_request_language_processing(text, language, interlocutor_sections)

    return response, 200


@ai_routes.route("/summarise_conversation", methods=["POST"])
@login_required
def summarise_conversation():
    user_id = current_user.id
    data = json.loads(request.data)
    conversation_id = data["conversation_id"]
    conversation = get_conversation(conversation_id=conversation_id)
    new_title = summarise(conversation.id, user_id, conversation.language)
    conversation.title = new_title
    conversation.title_updateable = 0

    db.session.commit()
    return {"new_title": conversation.title}


@ai_routes.route("/generate_image", methods=["POST"])
@login_required
def generate_image_for_conversation():
    user_id = current_user.id
    data = json.loads(request.data)
    conversation_id = data.get("conversation_id")
    conversation = get_conversation(conversation_id=conversation_id)
    if conversation:
        description = conversation.title

        conversation_language = conversation.language
        if conversation_language != "English" or conversation_language != "German":
            translated_description = translate_to(language="english", text=description)
            print(
                f"description : {description}\ntranslated_description : {translated_description}",
                flush=True,
            )
            description = translated_description

        picture_name = generate_new_image(user_id, description)
        conversation.picture = picture_name
        conversation.picture_updateable = 0
        db.session.commit()

        return {"picture_name": picture_name}
    else:
        return Response(f"Conversation with ID {conversation_id} not found", status=404)


def generate_new_image(user_id, description):
    data = image_generator.request(description=description)

    image_data = requests.get(data["url"])
    picture_name = f"image_{str(user_id)}_{str(uuid.uuid4())}.png"

    success = aws_s3.upload_image(
        io.BytesIO(image_data.content),
        picture_name,
        "image/png",
    )
    if success:
        return picture_name
    else:
        return "conversation_default.png"


def summarise(conversation_id, user_id, language):
    sections = get_conversation_history(
        conversation_id=conversation_id, user_id=user_id
    )

    response = request_for_summary(sections, language)

    return response["summarizer"]["content"][:150]


def request_for_summary(sections, language):
    token = 35
    language_instruction = f" Respond in {language}."

    summarizer = {
        "name": "summarizer",
        "system_message": CONFIG["language_processing"]["instructions"]["summarizer"]
        + language_instruction,
        "sections": sections,
    }

    response = language_processor.request(
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


def api_request_language_processing(text, language, interlocutor_sections):
    token = 100
    language_instruction = f" Respond only in {language}."

    interlocutor = {
        "name": "interlocutor",
        "system_message": CONFIG["language_processing"]["instructions"]["interlocutor"]
        + language_instruction,
        "sections": interlocutor_sections,
    }

    corrector = {
        "name": "corrector",
        "system_message": CONFIG["language_processing"]["instructions"]["corrector"]
        + language_instruction,
        "sections": [{"role": "user", "content": text}],
    }

    print(f"interlocutor request payload: {interlocutor}", flush=True)

    response = language_processor.request(
        token=token,
        model=CONFIG["language_processing"]["model"],
        instances=[interlocutor, corrector],
    )
    return response


def translate_to(language: str, text: str):
    translator = {
        "name": "translator",
        "system_message": f"Translate the text to {language}",
        "sections": [{"role": "user", "content": text}],
    }

    response = language_processor.request(
        token=100,
        model=CONFIG["language_processing"]["model"],
        instances=[translator],
    )
    return response["translator"]["content"][:150]
