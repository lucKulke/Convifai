from flask import Blueprint, request, Response
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
import uuid

auth = Blueprint("auth", __name__)


@auth.route("/login", methods=["POST"])
def login():
    if request.method == "POST":
        data = request.get_json()
        print(data, flush=True)
        username = data.get("username")
        password = data.get("password")
        print(password, flush=True)

        user = User.query.filter_by(username=username).first()
        if user:
            if check_password_hash(user.password, password):
                login_user(user, remember=True)
                return Response(status=201)
            else:
                return Response("wrong password", status=423)
        else:
            return Response("no such entry", status=406)
    return "no post method"


@auth.route("/login_status")
def login_status():
    if request.method == "GET":
        if current_user.is_authenticated:
            return Response("true", status=200)
        else:
            return Response("false", status=204)
    return "no get method"


@auth.route("/logout", methods=["POST"])
@login_required
def logout():
    if request.method == "POST":
        logout_user()

        return Response("logged out", status=201)
    return "no post method"


@auth.route("/sign_up", methods=["POST"])
def sign_up():
    if request.method == "POST":
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        user = User.query.filter_by(username=username).first()

        if user:
            return Response("you already have an account", status=406)
        else:
            new_user = User(
                id=uuid.uuid4(),
                username=username,
                password=generate_password_hash(password=password, method="sha256"),
            )
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user)
            return Response("signed up", status=201)
    return "no post method"
