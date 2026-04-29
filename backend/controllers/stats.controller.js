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
          const d = new Date(block.startTime);
          const date = [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
          heatData[date] = (heatData[date] || 0) + 1;
        }
      });
    }

    const completedTopicsHeat = await Topic.find({ userId, isCompleted: true });
    completedTopicsHeat.forEach(topic => {
      if (topic.completedAt) {
        const d = new Date(topic.completedAt);
        const date = [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
        heatData[date] = (heatData[date] || 0) + 1;
      }
    });

    // 3. Real Streak Calculation
    let streak = 0;
    if (Object.keys(heatData).length > 0) {
      const today = new Date();
      const todayStr = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = [yesterday.getFullYear(), String(yesterday.getMonth() + 1).padStart(2, '0'), String(yesterday.getDate()).padStart(2, '0')].join('-');
      
      let checkDate = new Date();
      if (!heatData[todayStr] && !heatData[yesterdayStr]) {
        streak = 0;
      } else {
        if (!heatData[todayStr]) {
          checkDate.setDate(checkDate.getDate() - 1);
        }
        while (true) {
          const checkStr = [checkDate.getFullYear(), String(checkDate.getMonth() + 1).padStart(2, '0'), String(checkDate.getDate()).padStart(2, '0')].join('-');
          if (heatData[checkStr]) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }
    }

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
