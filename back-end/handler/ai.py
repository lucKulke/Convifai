from flask import Blueprint

ai = Blueprint("ai", __name__)


@ai.route("/voice_to_text")
def voice_to_text():
    return "Voice to Text"


@ai.route("/text_to_voice")
def text_to_voice():
    return "Text to Voice"


@ai.route("/language_processing")
def language_processing():
    return "Language processing"
