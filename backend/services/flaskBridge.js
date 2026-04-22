const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const FLASK_URL = process.env.FLASK_AI_URL || 'http://localhost:5001';
const SECRET = process.env.NODE_BACKEND_SECRET || 'your-shared-secret';

const flaskApi = axios.create({
  baseURL: FLASK_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Node-Secret': SECRET
  },
  timeout: 60000 // 60 seconds
});

/**
 * Forwards PDF data to Flask for topic extraction
 */
exports.extractTopics = async (subjectId, pdfData) => {
  try {
    const response = await flaskApi.post('/extract-topics', {
      subjectId,
      filePath: pdfData.filePath
    });
    return response.data;
  } catch (error) {
    console.error('Error calling Flask extract-topics:', error.message);
    throw error;
  }
};

/**
 * Forwards chat requests to Flask
 */
exports.chatWithGuru = async (subjectId, userId, message, settings) => {
  try {
    const response = await flaskApi.post('/chat', {
      subjectId,
      userId,
      message,
      settings
    });
    return response.data;
  } catch (error) {
    console.error('Error calling Flask chat:', error.message);
    throw error;
  }
};

// Add other bridge functions as needed
