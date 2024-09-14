from flask import Blueprint, request, jsonify, current_app
import os
from werkzeug.utils import secure_filename
from app.utils import update_matching_engine, gcs_client
bp = Blueprint('upload', __name__)

ALLOWED_EXTENSIONS = {'pdf'}

# Function to check if file is allowed
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@bp.route('/upload_file', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        try:
            filename = secure_filename(file.filename)

            # Save to local path
            upload_folder = current_app.config['UPLOAD_FOLDER']
            file_path = os.path.join(upload_folder, filename)
            file.save(file_path)

            # Save file to GCS
            blob_path = f"PDFs/{filename}"
            gcs_client.upload_file(file_path, blob_path)

            # Update Matching Engine
            update_matching_engine(file_path, filename, current_app.config['IMAGES_FOLDER'])
            print('finish update')

            # os.remove(file_path)  # Remove the file after processing

            return jsonify({
                'message': 'File processed successfully',
            }), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'File type not allowed'}), 400
