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
    
    saved_file_paths = []
    
    # Handle multipart/form-data (File uploads)
    if 'files' in request.files:
        files = request.files.getlist('files')
        subject_id = request.form.get('subjectId')
        user_id = request.form.get('userId')
        import json
        topics = json.loads(request.form.get('topics', '[]'))
        
        temp_dir = os.path.join(os.getcwd(), 'temp_uploads')
        if not os.path.exists(temp_dir):
            os.makedirs(temp_dir)
            
        for file in files:
            file_path = os.path.join(temp_dir, file.filename)
            file.save(file_path)
            saved_file_paths.append(file_path)
    else:
        # Handle JSON
        data = request.json
        user_id = data.get('userId')
        subject_id = data.get('subjectId')
        saved_file_paths = data.get('filePaths', [])
        topics = data.get('topics', [])
    
    if not all([user_id, subject_id, saved_file_paths, topics]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        result = analyze_pyqs(saved_file_paths, user_id, subject_id, topics)
        # Clean up
        if 'files' in request.files:
            for p in saved_file_paths:
                if os.path.exists(p):
                    os.remove(p)
        return jsonify(result), 200
    except Exception as e:
        if 'files' in request.files:
            for p in saved_file_paths:
                if os.path.exists(p):
                    os.remove(p)
        print(f"PYQ Analysis error: {str(e)}")
        return jsonify({"error": str(e)}), 500

