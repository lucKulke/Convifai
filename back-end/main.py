from handler import create_app
from werkzeug.exceptions import HTTPException
import json

app, cache = create_app()


@app.errorhandler(HTTPException)
def handle_exception(error):
    response = error.get_response()
    response.data = json.dumps(
        {
            "code": error.code,
            "name": error.name,
            "description": error.description,
        }
    )
    response.content_type = "application/json"
    response.status_code = 500
    return response


if __name__ == "__main__":
    gunicorn_options = {
        "bind": "0.0.0.0:8000",
        "workers": 1,
    }

    from gunicorn.app.base import BaseApplication

    class StandaloneApplication(BaseApplication):
        def __init__(self, app, options=None):
            self.options = options or {}
            self.application = app
            super().__init__()

        def load_config(self):
            for key, value in self.options.items():
                self.cfg.set(key, value)

        def load(self):
            return self.application

    StandaloneApplication(
        app, gunicorn_options
    ).run()  # for network test host="0.0.0.0"
