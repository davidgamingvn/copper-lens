from flask import Blueprint, request, jsonify, send_file
from ..utils import gcs_client
import io

bp = Blueprint('get_pdf', __name__)

# /get_pdf?filename=example.pdf
@bp.route('/get_pdf', methods=['GET'])
def get_pdf():
    filename = request.args.get('filename')
    
    if not filename:
        return jsonify({'error': 'No filename provided'}), 400
    
    try:
        pdf_bytes = gcs_client.download_as_bytes(f"PDFs/{filename}")
        pdf_stream = io.BytesIO(pdf_bytes)
        # Send the file to the client
        return send_file(
            pdf_stream,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=filename
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500