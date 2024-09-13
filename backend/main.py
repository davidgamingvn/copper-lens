from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from app.routes import upload_file, ask_question, scrape_web
<<<<<<< Updated upstream
from utils import update_matching_engine, get_qa_chain, web_scraping
=======
from app.utils import extract_images_from_pdf, extract_text_from_pdf, generate_embeddings
>>>>>>> Stashed changes
import json
import os
from config import Config


# Create a Flask app instance
app = Flask(__name__)
app.config.from_object(Config)

# Initialize CORS
CORS(app)

# Set the upload folder
UPLOAD_FOLDER = './uploads'

# Configure the Flask app
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

app.register_blueprint(upload_file.bp)
app.register_blueprint(ask_question.bp)
app.register_blueprint(scrape_web.bp)

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
