
from flask import Flask
from .config import Config
from .extensions import db, migrate, jwt
from .routes import auth_bp, trips_bp, contact_bp
from flask_cors import CORS  



def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:5173"}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"]
    )

    # Init extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(trips_bp, url_prefix="/api/trips")
    app.register_blueprint(contact_bp, url_prefix="/api/contact")

    return app
