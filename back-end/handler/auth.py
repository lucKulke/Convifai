from flask import Blueprint, request, Response

from . import db
from werkzeug.security import generate_password_hash, check_password_hash

from flask_login import (
    login_remembered,
    logout_user,
    login_user,
    login_required,
    current_user,
)
import uuid, os
from .crud import get_user, add_user


auth = Blueprint("auth", __name__)


@auth.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    print(data, flush=True)
    username = data.get("username")
    password = data.get("password")
    print(password, flush=True)

    user = get_user(username)
    if user:
        if check_password_hash(user.password, password):
            login_user(user, remember=True)
            return Response(status=201)
        else:
            return Response("wrong password", status=423)
    else:
        return Response("no such entry", status=406)


@auth.route("/login_status", methods=["GET"])
def login_status():
    if current_user.is_authenticated:
        return Response("true", status=200)
    else:
        return Response("false", status=204)


@auth.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()

    return Response("logged out", status=201)


@auth.route("/sign_up", methods=["POST"])
def sign_up():
    return Response(
        "No more accounts can be registerd. Please contact the admin for more information..."
    )
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = get_user(username=username)

    if user:
        return Response("you already have an account", status=406)
    else:
        new_user = add_user(
            id=str(uuid.uuid4()),
            username=username,
            password=generate_password_hash(password=password, method="pbkdf2:sha256"),
        )

        db.session.commit()

        login_user(new_user)
        return Response("signed up", status=201)
