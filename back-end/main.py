from handler import create_app
from werkzeug.exceptions import HTTPException
import json

app = create_app()


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
    return response


if __name__ == "__main__":
    app.run(port=8000, debug=True)  # for network test host="0.0.0.0"
