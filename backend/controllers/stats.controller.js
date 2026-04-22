const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const Schedule = require('../models/Schedule');

// @desc    Get user analytics for dashboard
// @route   GET /api/stats/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Completion Rate per Subject
    const subjects = await Subject.find({ userId });
    const completionStats = await Promise.all(subjects.map(async (subj) => {
      const totalTopics = await Topic.countDocuments({ subjectId: subj._id });
      const completedTopics = await Topic.countDocuments({ subjectId: subj._id, isCompleted: true });
      return {
        subjectId: subj._id,
        name: subj.name,
        percentage: totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0
      };
    }));

    // 2. Study Heatmap (Last 30 days of completed blocks)
    const schedule = await Schedule.findOne({ userId });
    const heatData = {}; // Format: { "YYYY-MM-DD": count }
    
    if (schedule) {
      schedule.blocks.forEach(block => {
        if (block.isCompleted && block.startTime) {
          const date = block.startTime.toISOString().split('T')[0];
          heatData[date] = (heatData[date] || 0) + 1;
        }
      });
    }

    // 3. Streak (Simplified)
    // In a real app index completion dates and check continuity
    const streak = 3; // Placeholder

    res.status(200).json({
      success: true,
      data: {
        completionStats,
        heatmap: heatData,
        streak,
        totalSubjects: subjects.length
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
