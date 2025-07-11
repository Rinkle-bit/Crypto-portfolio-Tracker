from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    from .routes import main
    from .models import Portfolio

    app = Flask(__name__)
    app.secret_key = 'a3c5e98fbb3e4acfa21376cc47febb4d'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///portfolio.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    CORS(app)

    app.register_blueprint(main, url_prefix='/api')

    with app.app_context():
        db.create_all()

    return app
