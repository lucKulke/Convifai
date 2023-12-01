import json
import requests
import os, io
from pydub import AudioSegment
import datetime

TOKEN_MANAGEMENT_URL = os.getenv("TOKEN_MANAGEMENT_URL")
AIHUB_CONFIG = {
    "server_url": f"{os.getenv('AIHUB_URL')}/token",
    "username": os.getenv("AIHUB_USERNAME"),
    "password": os.getenv("AIHUB_PASSWORD"),
}


from werkzeug.exceptions import HTTPException


class AIHub:
    def get_auth_token(self):
        try:
            response = requests.post(TOKEN_MANAGEMENT_URL, json=AIHUB_CONFIG)
            response.raise_for_status()
        except requests.exceptions.RequestException as errex:
            print(f"error while try to fetch token: {errex}")
            raise HTTPException
        json_response = response.json()

        return f"{json_response.get('token_type')} {json_response.get('access_token')}"


class LanguageProcessing(AIHub):
    def __init__(self, url) -> None:
        self.url = url

    def request(self, token, model, instances):
        auth_token = self.get_auth_token()

        payload = {"instances": {}, "model": model, "token": token}
        for instance in instances:
            name = instance["name"]
            system_message = instance["system_message"]
            sections = instance["sections"]
            payload["instances"][name] = {
                "system_message": system_message,
                "sections": sections,
            }

        payload = json.dumps(payload)
        # print(payload, flush=True)
        try:
            response = requests.post(
                f"{self.url}/language_processing/chat_gpt",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": auth_token,
                },
                data=payload,
            )
            response.raise_for_status()

        except requests.exceptions.RequestException as errex:
            print(f"error in {type(self).__name__} service: {errex}", flush=True)
            raise HTTPException

        return response.json()


class VoiceToText(AIHub):
    def __init__(self, url) -> None:
        self.url = url

    def request(self, audio_file):
        auth_token = self.get_auth_token()
        print(audio_file.stream, flush=True)

        print(datetime.datetime.now(), flush=True)
        webm_audio = AudioSegment.from_file(audio_file.stream, format="webm")

        # Export AudioSegment as WAV file
        wav_buffer = io.BytesIO()
        webm_audio.export(wav_buffer, format="wav")
        print(datetime.datetime.now(), flush=True)
        files = {
            "audiofile": (
                audio_file.filename,
                wav_buffer.getvalue(),
                "audio/wav",
            )
        }

        try:
            response = requests.post(
                f"{self.url}/voice_to_text/whisper/?model=small&only_text=true&timeout=200",
                headers={"Authorization": auth_token},
                # form fields
                files=files,  # audio file
            )
            response.raise_for_status()
        except requests.exceptions.RequestException as errex:
            print(f"error in {type(self).__name__} service: {errex}", flush=True)
            raise HTTPException
        return response


class TextToVoice(AIHub):
    def __init__(self, url) -> None:
        self.url = url

    def request(self, text, language):
        auth_token = self.get_auth_token()

        payload = {"text": text, "language": language}
        try:
            response = requests.post(
                f"{self.url}/text_to_voice/azure",
                headers={"Authorization": auth_token},
                data=json.dumps(payload),
                stream=True,
            )
            response.raise_for_status()
        except requests.exceptions.RequestException as errex:
            print(f"error in {type(self).__name__} service: {errex}", flush=True)
            raise HTTPException
        return response


class ImageGenerator(AIHub):
    def __init__(self, url) -> None:
        self.url = url

    def request(self, description):
        auth_token = self.get_auth_token()

        payload = {
            "description": description + ", cartoon style",
            "number_of_pictures": 1,
            "size": "512x512",
        }
        try:
            response = requests.post(
                f"{self.url}/image_generation/dalle",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": auth_token,
                },
                json=payload,
            )
            response.raise_for_status()
        except requests.exceptions.RequestException as errex:
            print(f"error in {type(self).__name__} service: {errex}", flush=True)
            raise HTTPException

        return response.json()
