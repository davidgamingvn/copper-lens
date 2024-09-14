from flask import Blueprint, request, jsonify
from ..utils import get_qa_chain  # Adjust the import based on your project structure

bp = Blueprint('qa', __name__)

@bp.route('/ask_question', methods=['POST'])
def ask_question():
    data = request.json
    question = data.get('question')
    
    if not question:
        return jsonify({'error': 'No question provided'}), 400
    
    try:
        qa_chain = get_qa_chain(question=question)
        # answer = qa_chain.run(question)
        # print('answer: ', answer)
        return jsonify({
            'question': question,
            'answer': qa_chain
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500