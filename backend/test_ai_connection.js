const axios = require('axios');

const FLASK_URL = 'https://syllabusai.onrender.com';
const SECRET = 'super-secret-key-123';

async function testChat() {
  try {
    console.log('Testing AI Backend at:', FLASK_URL);
    const response = await axios.post(`${FLASK_URL}/chat`, {
      subjectId: '65f1a2b3c4d5e6f7a8b9c0d1', // Mock ID
      userId: '65f1a2b3c4d5e6f7a8b9c0d2', // Mock ID
      message: 'Hello, Guru!',
      history: [],
      personality: 'Friendly'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-Node-Secret': SECRET
      }
    });
    console.log('Response Status:', response.status);
    console.log('Response Data:', response.data);
  } catch (error) {
    console.error('Test Failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testChat();
