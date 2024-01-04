import typing
from botocore.config import Config
import boto3
import io


class AWS_S3:
    def __init__(
        self, region: str, bucket_name: str, signature_version: str, retries: dict
    ) -> None:
        self.region = region
        self.bucket_name = bucket_name
        self.my_config = Config(
            region_name=self.region,
            signature_version=signature_version,
            retries=retries,
        )

        self.s3_client = boto3.client("s3", config=self.my_config)

    def upload_image(self, file: typing.BinaryIO, key: str, file_content_type: str):
        print(f"uploading image to s3 bucket: {self.bucket_name}")
        try:
            self.s3_client.upload_fileobj(
                file,
                self.bucket_name,
                key,
                ExtraArgs={"ContentType": file_content_type},
            )
        except Exception as e:
            print(f"upload error s3 {e}", flush=True)
            return False
        return True

    def download_image_obj(self, key: str):
        fileobj = io.BytesIO()
        print(f"downloading image from s3 bucket: {self.bucket_name}")
        try:
            self.s3_client.download_fileobj(self.bucket_name, key, fileobj)
        except Exception as e:
            print(f"download error s3 {e}", flush=True)
        fileobj.seek(0)  # Reset the cursor position to the beginning
        return fileobj
