import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from routes.extract import extract_bp

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(extract_bp)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "service": "SyllabusAI-AI-Backend"}), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
