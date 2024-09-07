from flask import Flask
from flask_cors import CORS
from app.routes import langchain_routes, gemini_routes, scraping_routes
from config import Config


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize CORS
    CORS(app)

    # Register blueprints
    app.register_blueprint(langchain_routes.bp)
    app.register_blueprint(gemini_routes.bp)
    app.register_blueprint(scraping_routes.bp)

    @app.route('/')
    def hello():
        return "Welcome to the Flask API for AI and Web Scraping!"

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
