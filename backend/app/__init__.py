from flask import Flask
from flask_jwt_extended import JWTManager
from app.extensions import db, migrate
from app.config import config_by_name
import os


def create_app(config_name='development'):
    """Application factory function"""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config_by_name[config_name])
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt = JWTManager(app)
    
    # Register blueprints
    from app.auth.routes import auth_bp
    from app.users.routes import users_bp
    from app.skills.routes import skills_bp
    from app.requests.routes import requests_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(skills_bp, url_prefix='/api/skills')
    app.register_blueprint(requests_bp, url_prefix='/api/requests')
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    return app
