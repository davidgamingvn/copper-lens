from flask import Blueprint, request, jsonify
# Adjust the import based on your project structure
from ..utils import web_scraping

bp = Blueprint('scrape', __name__)


@bp.route('/scrape_web', methods=['POST'])
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
