from flask import Blueprint, request, Response, session
from .models import User
from . import db
from werkzeug.security import generate_password_hash, check_password_hash
import json
from flask_login import (
    login_remembered,
    logout_user,
    login_user,
    login_required,
    current_user,
)

auth = Blueprint("auth", __name__)


@auth.route("/login", methods=["POST"])
def login():
    data = json.loads(request.data)
    username = data["username"]
    password = data["password"]

    user = User.query.filter_by(username=data["username"]).first()
    if user:
        if check_password_hash(user.password, password):
            login_user(user, remember=True)
            return f"{user.username} with id: {user.id} logged in"
        else:
            return "wrong password"
    else:
        return "no such entry"


@auth.route("/logout", methods=["POST"])
@login_required
def logout():
    username = current_user.username
    logout_user()

    return f"{username} logged_out"


@auth.route("/sign_up", methods=["POST"])
def sign_up():
    data = json.loads(request.data)
    username = data["username"]
    password = data["password"]

    user = User.query.filter_by(username=username).first()

    if user:
        return "you already have an account"
    else:
        new_user = User(
            username=username,
            password=generate_password_hash(password=password, method="sha256"),
        )
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user)
        return f"{username} you are signed up and logged in"
