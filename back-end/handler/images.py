from flask import Blueprint, request, Response, send_from_directory, send_file
import os

images = Blueprint("images", __name__)


@images.route("/<image_id>")
def serve_image(image_id):
    return send_file(f"../img/{image_id}")
