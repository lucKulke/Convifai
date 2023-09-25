from flask import Flask

import os


def create_app():
    app = Flask(__name__)
    app.config["SECRET"] = "jhasdfsadf"  # os.getenv("SESSION_SECRET")

    from .ai import ai
    from .auth import auth

    app.register_blueprint(ai, url_prefix="/ai")
    app.register_blueprint(auth, url_prefix="/auth")
    return app
