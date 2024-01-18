from flask import Blueprint, send_file, request
from flask_login import current_user
from .utilitys import AWS_S3
import os
from . import cache

images = Blueprint("images", __name__)
aws_s3 = AWS_S3(
    region=os.getenv("AWS_BUCKET_REGION"),
    bucket_name=os.getenv("AWS_BUCKET_NAME"),
    signature_version="v4",
    retries={"max_attempts": 10, "mode": "standard"},
)


@cache.cached(timeout=None, key_prefix=lambda: request.path)
def get_image_from_s3(image_id):
    image_bytes = aws_s3.download_image_obj(image_id)

    cache.set(f"user_image_mapping:{image_id}", image_id)
    return image_bytes


@images.route("/<image_id>", methods=["GET"])
def serve_image(image_id):
    if image_id == "conversation_default.png":
        return send_file("../img/robot.png")

    bytesobj = get_image_from_s3(image_id)
    return send_file(bytesobj, mimetype="image/png", download_name=image_id)
