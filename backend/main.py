from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
# from app.routes import langchain_routes, gemini_routes, scraping_routes
from utils import update_matching_engine, get_qa_chain, web_scraping
import json
import os
from config import Config


# Create a Flask app instance
app = Flask(__name__)
app.config.from_object(Config)

# Initialize CORS
CORS(app)

# Set the upload folder and allowed file types
UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = {'pdf'}

# Configure the Flask app
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload directory exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Function to check if file is allowed
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload_file', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        try:
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            
            # Update Matching Engine
            update_matching_engine(file_path)
            print('finish update')
            
            # os.remove(file_path)  # Remove the file after processing
            
            return jsonify({
                'message': 'File processed successfully',
            }), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Invalid file type. Please upload a PDF.'}), 400

@app.route('/ask_question', methods=['POST'])
def ask_question():
    data = request.json
    question = data.get('question')
    
    if not question:
        return jsonify({'error': 'No question provided'}), 400
    
    try:
        qa_chain = get_qa_chain()
        answer = qa_chain.run(question)
        print('answer: ', answer)
        return jsonify({
            'question': question,
            'answer': answer
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/scrape_data', methods=['POST'])
def scrape_data():
    try:
        data = request.json
        url = data.get('url', '')
        print('url: ', url)

        if not url:
            return jsonify({'error': 'URL is required'}), 400

        # Call the web scraping utility function
        result = web_scraping(url)

        return jsonify({'status': result}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
