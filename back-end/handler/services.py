import json
import requests


class LanguageProcessing:
    def __init__(self, url) -> None:
        self.url = url

    def request(self, token, model, instances):
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
        print(payload, flush=True)
        response = requests.post(
            f"{self.url}/language_processing/chat_gpt",
            headers={"Content-Type": "application/json"},
            data=payload,
        )
        if response.status_code == 200:
            return response.json()
        else:
            "error"


class VoiceToText:
    def __init__(self, url) -> None:
        self.url = url

    def request(self, audio_file):
        data = {
            "model": "small",
        }

        files = {"audio_file": ("audio.wav", audio_file)}

        response = requests.post(
            f"{self.url}/voice_to_text/whisper?only_text=true",
            data=data,  # form fields
            files=files,  # audio file
        )
        return response


class TextToVoice:
    def __init__(self, url) -> None:
        self.url = url

    def request(self, text, language):
        payload = {"text": text, "language": language}
        response = requests.post(
            f"{self.url}/text_to_voice/azure",
            data=json.dumps(payload),
            stream=True,
        )
        return response


class ImageGenerator:
    def __init__(self, url) -> None:
        self.url = url

    def request(self, description):
        payload = {
            "description": description + ", cartoon style",
            "number_of_pictures": 1,
            "size": "512x512",
        }

        response = requests.post(
            f"{self.url}/image_generation/dalle",
            headers={"Content-Type": "application/json"},
            json=payload,
        )

        return response.json()
