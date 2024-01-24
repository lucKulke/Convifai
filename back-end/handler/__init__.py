from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
import os
from os import path
from flask_login import LoginManager
from flask_cors import CORS
from flask_caching import Cache


class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)
cache = Cache()
app = Flask(__name__)


def create_app():
    CORS(
        app,
        resources={r"/*": {"origins": os.getenv("FRONT_END_URL")}},
        supports_credentials=True,
    )
    app.secret_key = os.getenv("SESSION_SECRET")
    app.config["SESSION_TYPE"] = "filesystem"
    app.config[
        "SQLALCHEMY_DATABASE_URI"
    ] = f'{os.getenv("DB_TYPE")}://{os.getenv("DB_USER")}:{os.getenv("DB_PASSWORD")}@{os.getenv("DB_HOST")}:{os.getenv("DB_PORT")}/{os.getenv("DB_NAME")}'
    # mysql+pymysql
    app.config["CACHE_TYPE"] = "filesystem"
    app.config["CACHE_DIR"] = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "..", "img_cache", "cache"
    )  # Adjust this to your desired cache directory
    app.config["CACHE_DEFAULT_TIMEOUT"] = 3600

    cache.init_app(app)

    db.init_app(app)

    from .ai_routes import ai_routes
    from .auth import auth
    from .user_data import user_data
    from .images import images

    app.register_blueprint(ai_routes, url_prefix="/ai_routes")
    app.register_blueprint(auth, url_prefix="/auth")
    app.register_blueprint(user_data, url_prefix="/user_data")
    app.register_blueprint(images, url_prefix="/images")

    from .models import Users, Conversation, Iteration

    with app.app_context():
        db.create_all()

    login_manager = LoginManager()

    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(id):
        return Users.query.get(id)

    return app, cache
