const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const FLASK_URL = process.env.FLASK_AI_URL || 'http://localhost:8000';
const SECRET = process.env.NODE_BACKEND_SECRET || 'your-shared-secret';

const flaskApi = axios.create({
  baseURL: FLASK_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Node-Secret': SECRET
  },
  timeout: 60000 // 60 seconds
});

const FormData = require('form-data');
const fs = require('fs');

/**
 * Forwards PDF data to Flask for topic extraction
 */
exports.extractTopics = async (subjectId, userId, pdfData) => {
  try {
    const form = new FormData();
    form.append('subjectId', subjectId);
    form.append('userId', userId);
    form.append('file', fs.createReadStream(pdfData.filePath));

    const response = await axios.post(`${FLASK_URL}/extract-topics`, form, {
      headers: {
        ...form.getHeaders(),
        'X-Node-Secret': SECRET
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error calling Flask extract-topics:', error.message);
    if (error.response) {
      console.error('Flask Error Data:', error.response.data);
    }
    throw error;
  }
};


/**
 * Forwards chat requests to Flask
 */
exports.chatWithGuru = async (subjectId, userId, message, history, personality = 'Friendly') => {
  try {
    const payload = {
      subjectId,
      userId,
      message,
      history,
      personality
    };
    
    console.log('--- Outgoing Request to AI Backend ---');
    console.log('URL:', `${FLASK_URL}/chat`);
    console.log('Payload:', JSON.stringify(payload, null, 2));

    const response = await flaskApi.post('/chat', payload);
    
    console.log('--- AI Backend Response ---');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('--- AI Backend Call Failed ---');
    console.error('Error Calling Flask chat:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('No response received from AI Backend. Request was made.');
    }
    throw error;
  }
};


/**
 * Forwards PYQ analysis requests to Flask
 */
exports.analyzePYQ = async (subjectId, userId, filePaths, topics) => {
  try {
    const form = new FormData();
    form.append('subjectId', subjectId);
    form.append('userId', userId);
    form.append('topics', JSON.stringify(topics));
    
    filePaths.forEach((path, index) => {
      form.append('files', fs.createReadStream(path));
    });

    const response = await axios.post(`${FLASK_URL}/analyze-pyq`, form, {
      headers: {
        ...form.getHeaders(),
        'X-Node-Secret': SECRET
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error calling Flask analyze-pyq:', error.message);
    if (error.response) {
      console.error('Flask Error Data:', error.response.data);
    }
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
