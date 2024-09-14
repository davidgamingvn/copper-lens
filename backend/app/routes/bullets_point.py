from flask import Blueprint, jsonify
from ..utils import get_bullet_points

bp = Blueprint('bullet_points', __name__)

@bp.route('/bullet_points', methods=['GET'])
def bullets_point():
    try:
        bullet_points = get_bullet_points()
        return jsonify(bullet_points), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500