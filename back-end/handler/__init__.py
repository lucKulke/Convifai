from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
import os
from os import path
from flask_login import LoginManager
from flask_cors import CORS


class Base(DeclarativeBase):
    pass


DB_NAME = "database.db"
db = SQLAlchemy(model_class=Base)


def create_app():
    app = Flask(__name__)
    CORS(
        app,
        resources={r"/*": {"origins": "http://localhost:5173"}},
        supports_credentials=True,
    )
    app.secret_key = os.getenv("SESSION_SECRET")
    app.config["SESSION_TYPE"] = "filesystem"
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite3"

    db.init_app(app)

    from .ai import ai
    from .auth import auth
    from .user_data import user_data

    app.register_blueprint(ai, url_prefix="/ai")
    app.register_blueprint(auth, url_prefix="/auth")
    app.register_blueprint(user_data, url_prefix="/user_data")

    from .models import User, Conversation, Iteration

    with app.app_context():
        db.create_all()

    login_manager = LoginManager()

    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))

    return app
