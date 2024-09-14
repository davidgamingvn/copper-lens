from flask import Flask
from flask_cors import CORS
from app.routes import upload_file, ask_question, scrape_web, bullets_point
import os
from config import Config


# Create a Flask app instance
app = Flask(__name__)
app.config.from_object(Config)

# Initialize CORS
CORS(app)

# Ensure the upload directory exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# Ensure the images directory exists
if not os.path.exists(app.config['IMAGES_FOLDER']):
    os.makedirs(app.config['IMAGES_FOLDER'])

# Register the blueprints
app.register_blueprint(upload_file.bp)
app.register_blueprint(ask_question.bp)
app.register_blueprint(scrape_web.bp)
app.register_blueprint(bullets_point.bp)

# def create_app(config_class=Config):
#     app = Flask(__name__)
#     app.config.from_object(config_class)

#     # Initialize CORS
#     CORS(app)

#     # Register blueprints
#     app.register_blueprint(langchain_routes.bp)
#     app.register_blueprint(gemini_routes.bp)
#     app.register_blueprint(scraping_routes.bp)

#     @app.route('/')
#     def hello():
#         return "Welcome to the Flask API for AI and Web Scraping!"

#     return app


if __name__ == '__main__':
    # app.config['UPLOAD_FOLDER'] = 'uploads'
    # os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(debug=True)
