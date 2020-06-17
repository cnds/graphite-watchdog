import os

from flask import Flask, json
from werkzeug.exceptions import HTTPException


def create_app(test_config=None):
    """
    """
    flask_app = Flask(__name__)
    flask_app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(flask_app.instance_path, 'hawk.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        flask_app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        flask_app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(flask_app.instance_path)
    except OSError:
        pass

    @flask_app.errorhandler(HTTPException)
    def handle_exception(e):
        response = e.get_response()
        response.data = json.dumps({
            "error": e.description
        })
        response.content_type = "application/json"
        return response

    # from hawk import db
    # db.init_app(flask_app)

    return flask_app


app = create_app()
