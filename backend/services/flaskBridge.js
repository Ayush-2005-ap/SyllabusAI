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
exports.extractTopics = async (subjectId, userId, pdfData) => {
  try {
    const response = await flaskApi.post('/extract-topics', {
      subjectId,
      userId,
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
exports.chatWithGuru = async (subjectId, userId, message, history, personality = 'Friendly') => {
  try {
    const response = await flaskApi.post('/chat', {
      subjectId,
      userId,
      message,
      history,
      personality
    });
    return response.data;
  } catch (error) {
    console.error('Error calling Flask chat:', error.message);
    throw error;
  }
};

/**
 * Forwards PYQ analysis requests to Flask
 */
exports.analyzePYQ = async (subjectId, userId, filePaths, topics) => {
  try {
    const response = await flaskApi.post('/analyze-pyq', {
      subjectId,
      userId,
      filePaths,
      topics
    });
    return response.data;
  } catch (error) {
    console.error('Error calling Flask analyze-pyq:', error.message);
    throw error;
  }
};

/**
 * Forwards schedule generation requests to Flask
 */
exports.generateAISchedule = async (topics, examDate, dailyHours) => {
  try {
    const response = await flaskApi.post('/generate-schedule', {
      topics,
      examDate,
      dailyHours
    });
    return response.data;
  } catch (error) {
    console.error('Error calling Flask generate-schedule:', error.message);
    throw error;
  }
};

/**
 * Forwards quiz generation requests to Flask
 */
exports.generateQuiz = async (subjectId, userId, topicName) => {
  try {
    const response = await flaskApi.post('/generate-quiz', {
      subjectId,
      userId,
      topicName
    });
    return response.data;
  } catch (error) {
    console.error('Error calling Flask generate-quiz:', error.message);
    throw error;
  }
};

/**
 * Forwards evaluation requests to Flask
 */
exports.evaluateAnswer = async (question, userAnswer, correctAnswer) => {
  try {
    const response = await flaskApi.post('/evaluate-answer', {
      question,
      userAnswer,
      correctAnswer
    });
    return response.data;
  } catch (error) {
    console.error('Error calling Flask evaluate-answer:', error.message);
    throw error;
  }
};
