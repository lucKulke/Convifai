from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from threading import Lock
from datetime import datetime, timedelta
import requests

ctms = FastAPI()
lock = Lock()

ACCESS_TOKEN = None
EXPIRATION_TIME = None
TOKEN_TYPE = None


class UserCredentials(BaseModel):
    username: str
    password: str
    server_url: str


class TokenData(BaseModel):
    access_token: str
    token_type: str
    expires_at: float


@ctms.post("/get_token")
def get_token(request: UserCredentials):
    global ACCESS_TOKEN, EXPIRATION_TIME, TOKEN_TYPE

    with lock:
        # Check if the token is still valid for a reasonable duration
        if (
            EXPIRATION_TIME
            and EXPIRATION_TIME > (datetime.utcnow() + timedelta(minutes=5)).timestamp()
        ):
            return {
                "access_token": ACCESS_TOKEN,
                "token_type": TOKEN_TYPE,
                "expires_at": EXPIRATION_TIME,
            }

        # Fetch a new token from FastAPI server
        new_token_data = fetch_new_token(
            request.username, request.password, request.server_url
        )
        ACCESS_TOKEN = new_token_data.get("access_token")
        TOKEN_TYPE = new_token_data.get("token_type")
        EXPIRATION_TIME = new_token_data.get("expires_at")

    return {
        "access_token": ACCESS_TOKEN,
        "token_type": TOKEN_TYPE,
        "expires_at": EXPIRATION_TIME,
    }


def fetch_new_token(username, password, server_url):
    print("fetching new token...", flush=True)
    try:
        response = requests.post(
            server_url,
            data={"grant_type": "password", "username": username, "password": password},
        )

        if response.status_code == 401:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
            )
        if response.status_code == 403:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
            )
    except requests.exceptions.RequestException as errex:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"The requested server url: {server_url} cannot be reached",
        )

    response_data = response.json()
    return response_data


if __name__ == "__main__":
    ctms.run(port=8003)
