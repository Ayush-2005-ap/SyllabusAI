import os
from flask import Blueprint, request, jsonify
from services.scheduler import generate_smart_schedule

schedule_bp = Blueprint('ai_schedule', __name__)

NODE_BACKEND_SECRET = os.getenv('NODE_BACKEND_SECRET')

def verify_secret():
    secret = request.headers.get('X-Node-Secret')
    return secret == NODE_BACKEND_SECRET

@schedule_bp.route('/generate-schedule', methods=['POST'])
def generate_schedule():
    if not verify_secret():
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.json
    topics = data.get('topics', [])
    exam_date = data.get('examDate')
    daily_hours = data.get('dailyHours', 4)
    
    if not topics or not exam_date:
        return jsonify({"error": "Missing topics or examDate"}), 400

    try:
        result = generate_smart_schedule(topics, exam_date, daily_hours)
        return jsonify(result), 200
    except Exception as e:
        print(f"Schedule Gen error: {str(e)}")
        return jsonify({"error": str(e)}), 500
