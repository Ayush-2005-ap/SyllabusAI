const Schedule = require('../models/Schedule');
const Topic = require('../models/Topic');
const Subject = require('../models/Subject');

// @desc    Get user schedule
// @route   GET /api/schedule
// @access  Private
exports.getSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ userId: req.user.id }).populate('blocks.subjectId').populate('blocks.topicId');
    if (!schedule) {
      return res.status(200).json({ success: true, blocks: [] });
    }
    res.status(200).json({ success: true, data: schedule });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Generate a smart schedule
// @route   POST /api/schedule/generate
// @access  Private
exports.generateSchedule = async (req, res) => {
  try {
    const userId = req.user.id;
    const flaskBridge = require('../services/flaskBridge');
    
    // 1. Fetch user topics and subjects (for exam date)
    const topics = await Topic.find({ userId, isCompleted: false });
    const subjects = await Subject.find({ userId });
    
    if (topics.length === 0) {
      return res.status(400).json({ success: false, message: 'No pending topics found to schedule. Add subjects first.' });
    }

    // 2. Find closest exam date
    const validExamDates = subjects.filter(s => s.examDate).map(s => s.examDate);
    const closestExamDate = validExamDates.length > 0 
      ? new Date(Math.min(...validExamDates.map(d => new Date(d).getTime()))).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days from now default

    console.log('--- Calling AI Scheduler ---');
    const aiSchedule = await flaskBridge.generateAISchedule(
      topics.map(t => ({ 
        id: t._id, 
        name: t.name, 
        difficulty: t.difficulty, 
        pyqProbability: t.pyqProbability,
        estimatedHours: t.estimatedHours 
      })),
      closestExamDate,
      req.body?.dailyHours || 4
    );
    console.log('--- AI Schedule Received ---');

    // 3. Map AI blocks to MongoDB Schedule models
    const blocks = aiSchedule.blocks.map(block => {
      const topic = topics.find(t => t.name === block.topicName);
      const startTime = new Date(block.date);
      startTime.setHours(9, 0, 0, 0); // Logic could be more sophisticated but keeping it simple for now
      
      const endTime = new Date(startTime.getTime() + (block.duration || 2) * 3600000);

      return {
        subjectId: topic ? topic.subjectId : null,
        topicId: topic ? topic._id : null,
        title: block.topicName,
        type: block.type.toLowerCase(),
        startTime,
        endTime,
        isCompleted: false
      };
    });

    // 4. Save/Update Schedule
    let schedule = await Schedule.findOne({ userId });
    if (schedule) {
      schedule.blocks = blocks;
      await schedule.save();
    } else {
      schedule = await Schedule.create({ userId, blocks, weekStart: new Date() });
    }

    res.status(201).json({ success: true, data: schedule });
  } catch (error) {
    console.error('Schedule Generation Error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Update block completion
// @route   PATCH /api/schedule/block/:blockId
// @access  Private
exports.updateBlock = async (req, res) => {
  try {
    const { isCompleted, confidenceRating } = req.body;
    const schedule = await Schedule.findOne({ userId: req.user.id });
    
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }

    const block = schedule.blocks.id(req.params.blockId);
    if (!block) {
      return res.status(404).json({ success: false, message: 'Block not found' });
    }

    if (isCompleted !== undefined) block.isCompleted = isCompleted;
    if (confidenceRating !== undefined) block.confidenceRating = confidenceRating;

    // Adaptive Rescheduling: If confidence is low (1-2), add a revision block
    if (confidenceRating && confidenceRating <= 2) {
      const revisionBlock = {
        subjectId: block.subjectId,
        topicId: block.topicId,
        title: `Revision: ${block.title}`,
        type: 'revision',
        startTime: new Date(block.startTime.getTime() + 2 * 24 * 60 * 60 * 1000), // +2 days
        endTime: new Date(block.startTime.getTime() + 2 * 24 * 60 * 60 * 1000 + 45 * 60000), // +45 mins
        isCompleted: false
      };
      schedule.blocks.push(revisionBlock);
    }

    await schedule.save();
    res.status(200).json({ success: true, data: schedule });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
