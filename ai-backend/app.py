import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from routes.extract import extract_bp
from routes.chat import chat_bp
from routes.pyq import pyq_bp
from routes.schedule import schedule_bp
from routes.quiz import quiz_bp

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(extract_bp)
app.register_blueprint(chat_bp)
app.register_blueprint(pyq_bp)
app.register_blueprint(schedule_bp)
app.register_blueprint(quiz_bp)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "service": "SyllabusAI-AI-Backend"}), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
