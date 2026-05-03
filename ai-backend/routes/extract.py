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
    
    # Handle multipart/form-data (File upload)
    if 'file' in request.files:
        file = request.files['file']
        subject_id = request.form.get('subjectId')
        user_id = request.form.get('userId')
        
        if not all([subject_id, user_id]):
            return jsonify({"error": "Missing subjectId or userId"}), 400
            
        # Save file temporarily
        temp_dir = os.path.join(os.getcwd(), 'temp_uploads')
        if not os.path.exists(temp_dir):
            os.makedirs(temp_dir)
            
        file_path = os.path.join(temp_dir, file.filename)
        file.save(file_path)
    else:
        # Handle JSON (Local path - for backward compatibility/local dev)
        data = request.json
        if not data:
             return jsonify({"error": "No data provided"}), 400
             
        file_path = data.get('filePath')
        subject_id = data.get('subjectId')
        user_id = data.get('userId')
        
        if not file_path or not os.path.exists(file_path):
            return jsonify({"error": f"Invalid file path: {file_path}"}), 400

    if not subject_id or not user_id:
        return jsonify({"error": "Missing subjectId or userId"}), 400

    try:
        result = extract_topics_from_pdf(file_path, user_id, subject_id)
        # Clean up temp file if it was uploaded
        if 'file' in request.files and os.path.exists(file_path):
            os.remove(file_path)
        return jsonify(result), 200
    except Exception as e:
        if 'file' in request.files and os.path.exists(file_path):
            os.remove(file_path)
        return jsonify({"error": str(e)}), 500

