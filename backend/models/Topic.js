const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  estimatedHours: {
    type: Number,
    default: 2,
  },
  pyqProbability: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Low',
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Topic', topicSchema);
