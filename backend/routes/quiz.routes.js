const express = require('express');
const router = express.Router();
const { startQuiz, evaluateAnswer } = require('../controllers/quiz.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/generate', protect, startQuiz);
router.post('/evaluate', protect, evaluateAnswer);

module.exports = router;
