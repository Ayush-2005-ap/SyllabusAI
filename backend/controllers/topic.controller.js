const Topic = require('../models/Topic');
const flaskBridge = require('../services/flaskBridge');

// @desc    Get all topics for a subject
// @route   GET /api/topics/:subjectId
// @access  Private
exports.getTopics = async (req, res) => {
  try {
    const topics = await Topic.find({ 
      subjectId: req.params.subjectId,
      userId: req.user.id 
    });
    res.status(200).json({ success: true, count: topics.length, data: topics });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Extract topics from syllabus PDF
// @route   POST /api/topics/extract/:subjectId
// @access  Private
exports.extractTopics = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a syllabus PDF' });
    }

    const path = require('path');
    const absolutePath = path.resolve(req.file.path);

    console.log('--- Calling Flask AI ---');
    // Call Flask AI service via bridge
    const aiResponse = await flaskBridge.extractTopics(req.params.subjectId, {
      fileName: req.file.filename,
      filePath: absolutePath
    });
    console.log('--- AI Response Received ---');

    if (!aiResponse || !aiResponse.topics) {
      throw new Error('AI service failed to return topics');
    }

    // Save extracted topics to MongoDB
    const topicData = aiResponse.topics.map(topic => ({
      ...topic,
      subjectId: req.params.subjectId,
      userId: req.user.id
    }));

    const topics = await Topic.insertMany(topicData);

    res.status(200).json({ success: true, count: topics.length, data: topics });
  } catch (error) {
    console.error('Extraction error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Topic extraction failed' });
  }
};

// @desc    Update topic
// @route   PUT /api/topics/:id
// @access  Private
exports.updateTopic = async (req, res) => {
  try {
    let topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    if (topic.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    topic = await Topic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: topic });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete topic
// @route   DELETE /api/topics/:id
// @access  Private
exports.deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    if (topic.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await topic.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
