import os
from flask import Blueprint, request, jsonify
from services.pyq_analyzer import analyze_pyqs

pyq_bp = Blueprint('pyq', __name__)

NODE_BACKEND_SECRET = os.getenv('NODE_BACKEND_SECRET')

def verify_secret():
    secret = request.headers.get('X-Node-Secret')
    return secret == NODE_BACKEND_SECRET

@pyq_bp.route('/analyze-pyq', methods=['POST'])
def analyze_pyq():
    if not verify_secret():
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.json
    user_id = data.get('userId')
    subject_id = data.get('subjectId')
    file_paths = data.get('filePaths', [])
    topics = data.get('topics', [])
    
    if not all([user_id, subject_id, file_paths, topics]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        result = analyze_pyqs(file_paths, user_id, subject_id, topics)
        return jsonify(result), 200
    except Exception as e:
        print(f"PYQ Analysis error: {str(e)}")
        return jsonify({"error": str(e)}), 500
