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
    const aiResponse = await flaskBridge.extractTopics(req.params.subjectId, req.user.id, {
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

    if (req.body.isCompleted === true && !topic.isCompleted) {
      req.body.completedAt = new Date();
    } else if (req.body.isCompleted === false) {
      req.body.completedAt = null;
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
// @desc    Analyze Past Year Questions
// @route   POST /api/topics/pyq/analyze/:subjectId
// @access  Private
exports.analyzePYQ = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload PYQ PDF papers' });
    }

    const { subjectId } = req.params;
    const path = require('path');
    const filePaths = req.files.map(file => path.resolve(file.path));

    // Get current topics to send for context
    const topics = await Topic.find({ subjectId, userId: req.user.id });

    if (topics.length === 0) {
      return res.status(400).json({ success: false, message: 'Extract topics from syllabus before analyzing PYQs' });
    }

    console.log('--- Calling Flask for PYQ Analysis ---');
    const aiResponse = await flaskBridge.analyzePYQ(
      subjectId,
      req.user.id,
      filePaths,
      topics.map(t => ({ id: t._id, name: t.name }))
    );
    console.log('--- PYQ Analysis Complete ---');

    if (!aiResponse || !aiResponse.analysis) {
      throw new Error('AI service failed to analyze PYQs');
    }

    // Update topics in MongoDB with new probabilities
    const updatePromises = aiResponse.analysis.map(analysisItem => {
      return Topic.findOneAndUpdate(
        { subjectId, name: analysisItem.topicName, userId: req.user.id },
        { pyqProbability: analysisItem.probability },
        { new: true }
      );
    });

    const updatedTopics = await Promise.all(updatePromises);

    res.status(200).json({ 
      success: true, 
      message: 'PYQ analysis completed and topic probabilities updated',
      data: updatedTopics 
    });
  } catch (error) {
    console.error('PYQ Analysis error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'PYQ analysis failed' });
  }
};
