import os
from flask import Blueprint, request, jsonify
from services.extractor import extract_topics_from_pdf

extract_bp = Blueprint('extract', __name__)

NODE_BACKEND_SECRET = os.getenv('NODE_BACKEND_SECRET')

def verify_secret():
    secret = request.headers.get('X-Node-Secret')
    return secret == NODE_BACKEND_SECRET

@extract_bp.route('/extract-topics', methods=['POST'])
def extract_topics():
    if not verify_secret():
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.json
    file_path = data.get('filePath')
    subject_id = data.get('subjectId')
    user_id = data.get('userId')
    
    if not file_path or not os.path.exists(file_path):
        return jsonify({"error": "Invalid file path"}), 400

    if not subject_id or not user_id:
        return jsonify({"error": "Missing subjectId or userId"}), 400

    try:
        result = extract_topics_from_pdf(file_path, user_id, subject_id)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
