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
    
    // 1. Fetch all user topics that are not completed
    const topics = await Topic.find({ userId });
    
    if (topics.length === 0) {
      return res.status(400).json({ success: false, message: 'No topics found to schedule. Please add subjects and extract topics first.' });
    }

    // 2. Rule-based sorting (Priority = Difficulty + Probability)
    // Difficulty: Hard=3, Medium=2, Easy=1
    // Probability: High=3, Medium=2, Low=1 (Mocked for now if not present)
    const sortedTopics = topics.sort((a, b) => {
      const aWeight = (a.difficulty === 'Hard' ? 3 : a.difficulty === 'Medium' ? 2 : 1) + (a.pyqProbability === 'High' ? 3 : 2);
      const bWeight = (b.difficulty === 'Hard' ? 3 : b.difficulty === 'Medium' ? 2 : 1) + (b.pyqProbability === 'High' ? 3 : 2);
      return bWeight - aWeight;
    });

    // 3. Create blocks (Simplified: 1.5h blocks starting from tomorrow)
    const blocks = [];
    let currentTime = new Date();
    currentTime.setDate(currentTime.getDate() + 1); // Start tomorrow
    currentTime.setHours(9, 0, 0, 0); // Start at 9 AM

    for (const topic of sortedTopics) {
      const block = {
        subjectId: topic.subjectId,
        topicId: topic._id,
        title: topic.name,
        type: 'study',
        startTime: new Date(currentTime),
        endTime: new Date(currentTime.getTime() + 90 * 60000), // +90 mins
        isCompleted: false
      };
      blocks.push(block);
      
      // Move to next slot (e.g., 2 hours later)
      currentTime.setTime(currentTime.getTime() + 120 * 60000);
      
      if (currentTime.getHours() > 20) { // Limit to 8 PM
        currentTime.setDate(currentTime.getDate() + 1);
        currentTime.setHours(9, 0, 0, 0);
      }
    }

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
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
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

    await schedule.save();
    res.status(200).json({ success: true, data: schedule });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
