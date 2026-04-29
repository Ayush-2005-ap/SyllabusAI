const flaskBridge = require('../services/flaskBridge');

// @desc    Start a quiz for a subject/topic
// @route   POST /api/quiz/generate
// @access  Private
exports.startQuiz = async (req, res) => {
  try {
    const { subjectId, topicName } = req.body;

    if (!subjectId) {
      return res.status(400).json({ success: false, message: 'subjectId is required' });
    }

    const quiz = await flaskBridge.generateQuiz(subjectId, req.user.id, topicName);

    res.status(200).json({
      success: true,
      data: quiz.questions
    });
  } catch (error) {
    console.error('Quiz start error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to generate quiz' });
  }
};

// @desc    Evaluate a quiz answer (for short answers)
// @route   POST /api/quiz/evaluate
// @access  Private
exports.evaluateAnswer = async (req, res) => {
  try {
    const { question, userAnswer, correctAnswer } = req.body;

    if (!question || !userAnswer || !correctAnswer) {
      return res.status(400).json({ success: false, message: 'Missing evaluation parameters' });
    }

    const evaluation = await flaskBridge.evaluateAnswer(question, userAnswer, correctAnswer);

    res.status(200).json({
      success: true,
      data: evaluation
    });
  } catch (error) {
    console.error('Evaluation error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to evaluate answer' });
  }
};
