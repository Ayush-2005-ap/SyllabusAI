const mongoose = require('mongoose');

const scheduleBlockSchema = new mongoose.Schema({
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  title: String,
  type: {
    type: String,
    enum: ['study', 'revision', 'practice'],
    default: 'study'
  },
  startTime: Date,
  endTime: Date,
  isCompleted: {
    type: Boolean,
    default: false
  },
  confidenceRating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  }
});

const scheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blocks: [scheduleBlockSchema],
  weekStart: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Schedule', scheduleSchema);
