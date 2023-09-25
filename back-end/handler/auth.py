from flask import Blueprint, request, Response, session
import json

auth = Blueprint("auth", __name__)


@auth.route("/login", methods=["POST"])
def login():
    if session.get("logged_in") == True:
        data = json.loads(request.data)
        print(data["username"])

        session["user_id"] = data["username"]
        return f"{data['username']} is logged in"


@auth.route("/logout")
def logout():
    user_id = session["user_id"]
    if user_id == False:
        return "you are allready logged out"
    session["user_id"] = False
    return f"{user_id} is now logged out"


@auth.route("/sign_up")
def sign_up():
    return "sign up"
