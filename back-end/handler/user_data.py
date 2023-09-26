from flask import Blueprint

user_data = Blueprint("user_data", __name__)


@user_data.route("/conversation/:id")
def conversation():
    return "conversation id"


@user_data.route("/conversations")
def conversation():
    return "conversation id"


@user_data.route("/conversations/add")
def conversation_add():
    return "conversation add"


@user_data.route("/conversations/delete")
def conversation_delete():
    return "conversation delete"


@user_data.route("/conversations/picture")
def conversation_picture():
    return "Language processing"
