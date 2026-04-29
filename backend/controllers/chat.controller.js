const flaskBridge = require('../services/flaskBridge');

// @desc    Send a message to the AI Guru
// @route   POST /api/chat
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { subjectId, message, history, personality } = req.body;

    if (!subjectId || !message) {
      return res.status(400).json({ success: false, message: 'Please provide subjectId and message' });
    }

    // Forward to Flask AI Guru
    const aiResponse = await flaskBridge.chatWithGuru(
      subjectId,
      req.user.id,
      message,
      history || [],
      personality || 'Friendly'
    );

    res.status(200).json({
      success: true,
      data: aiResponse.response
    });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to get response from AI Guru' });
  }
};
