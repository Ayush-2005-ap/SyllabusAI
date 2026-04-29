import os
from flask import Blueprint, request, jsonify
from services.quiz_generator import generate_quiz, evaluate_short_answer

quiz_bp = Blueprint('quiz', __name__)

NODE_BACKEND_SECRET = os.getenv('NODE_BACKEND_SECRET')

def verify_secret():
    secret = request.headers.get('X-Node-Secret')
    return secret == NODE_BACKEND_SECRET

@quiz_bp.route('/generate-quiz', methods=['POST'])
def get_quiz():
    if not verify_secret():
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.json
    user_id = data.get('userId')
    subject_id = data.get('subjectId')
    topic_name = data.get('topicName')
    count = data.get('count', 5)
    
    if not user_id or not subject_id:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        result = generate_quiz(user_id, subject_id, topic_name, count)
        return jsonify(result), 200
    except Exception as e:
        print(f"Quiz Gen error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@quiz_bp.route('/evaluate-answer', methods=['POST'])
def evaluate():
    if not verify_secret():
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.json
    question = data.get('question')
    user_answer = data.get('userAnswer')
    correct_answer = data.get('correctAnswer')
    
    try:
        result = evaluate_short_answer(question, user_answer, correct_answer)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
