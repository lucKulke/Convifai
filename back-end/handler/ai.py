from flask import Blueprint
from flask_login import login_required
from flask import jsonify

ai = Blueprint("ai", __name__)


@ai.route("/available_languages")
@login_required
def available_languages():
    return jsonify(["English", "German"]), 200


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
