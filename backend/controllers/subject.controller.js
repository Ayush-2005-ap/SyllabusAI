const Subject = require('../models/Subject');

// @desc    Get all subjects for the logged in user
// @route   GET /api/subjects
// @access  Private
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.user.id }).lean();
    
    // Add topic stats to each subject
    const subjectsWithStats = await Promise.all(subjects.map(async (subject) => {
      const Topic = require('../models/Topic');
      const totalTopics = await Topic.countDocuments({ subjectId: subject._id });
      const completedTopics = await Topic.countDocuments({ subjectId: subject._id, isCompleted: true });
      
      return {
        ...subject,
        totalTopics,
        completedTopics,
        progress: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0
      };
    }));

    res.status(200).json({ success: true, count: subjectsWithStats.length, data: subjectsWithStats });
  } catch (error) {
    console.error('Error in getSubjects:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get single subject
// @route   GET /api/subjects/:id
// @access  Private
exports.getSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).lean();

    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    // Make sure user owns subject
    if (subject.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    // Add topic stats
    const Topic = require('../models/Topic');
    const totalTopics = await Topic.countDocuments({ subjectId: subject._id });
    const completedTopics = await Topic.countDocuments({ subjectId: subject._id, isCompleted: true });

    const data = {
      ...subject,
      totalTopics,
      completedTopics,
      progress: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0
    };

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create new subject
// @route   POST /api/subjects
// @access  Private
exports.createSubject = async (req, res) => {
  try {
    req.body.userId = req.user.id;

    const subject = await Subject.create(req.body);

    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private
exports.updateSubject = async (req, res) => {
  try {
    let subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    if (subject.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    if (subject.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await subject.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
