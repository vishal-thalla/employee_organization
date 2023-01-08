from flask import Flask
from flask import request
from flask import jsonify
from werkzeug.exceptions import HTTPException
from flask_restx import Api
from flask_migrate import Migrate
from flask_cors import CORS
from employee import employee_ns
from models import Employee


from exts import db


def create_app(config):
    # app=Flask(__name__,static_url_path='/',static_folder='./client/build')
    app = Flask(__name__)
    app.config.from_object(config)

    CORS(app, resources={r"/*": {"origins": "*", "allow_headers": "*", "expose_headers": "*"}})

    app.config['CORS_HEADERS'] = 'Content-Type'


    db.init_app(app)

    migrate = Migrate(app, db)

    api = Api(app, doc='/docs')

    api.add_namespace(employee_ns)

    @api.errorhandler(Exception)
    def handle_error(e):
        code = 500
        if isinstance(e, HTTPException):
            code = e.code
        return jsonify(error=str(e)), code


    @app.shell_context_processor
    def make_shell_context():
        return dict(app=app, db=db, Employee=Employee)

    return app