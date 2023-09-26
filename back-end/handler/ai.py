from flask import Blueprint
from flask_login import login_required

ai = Blueprint("ai", __name__)


@ai.route("/voice_to_text")
@login_required
def voice_to_text():
    return "Voice to Text"


@ai.route("/text_to_voice")
@login_required
def text_to_voice():
    return "Text to Voice"


@ai.route("/language_processing")
@login_required
def language_processing():
    return "Language processing"
