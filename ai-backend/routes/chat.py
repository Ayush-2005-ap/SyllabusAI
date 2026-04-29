import os
from flask import Blueprint, request, jsonify
from services.rag_chat import get_teaching_response

chat_bp = Blueprint('chat', __name__)

NODE_BACKEND_SECRET = os.getenv('NODE_BACKEND_SECRET')

def verify_secret():
    secret = request.headers.get('X-Node-Secret')
    return secret == NODE_BACKEND_SECRET

@chat_bp.route('/chat', methods=['POST'])
def chat():
    if not verify_secret():
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.json
    user_id = data.get('userId')
    subject_id = data.get('subjectId')
    message = data.get('message')
    history = data.get('history', [])
    personality = data.get('personality', 'Friendly')
    
    if not all([user_id, subject_id, message]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        response = get_teaching_response(user_id, subject_id, message, history, personality)
        return jsonify({"response": response}), 200
    except Exception as e:
        print(f"Chat error: {str(e)}")
        return jsonify({"error": str(e)}), 500
