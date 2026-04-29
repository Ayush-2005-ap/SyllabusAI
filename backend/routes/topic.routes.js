const express = require('express');
const router = express.Router();
const {
  getTopics,
  extractTopics,
  updateTopic,
  deleteTopic,
  analyzePYQ
} = require('../controllers/topic.controller');
const { protect } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');

// Protect all routes
router.use(protect);

router.post('/extract/:subjectId', upload.single('syllabus'), extractTopics);
router.post('/pyq/analyze/:subjectId', upload.array('pyqs'), analyzePYQ);
router.get('/:subjectId', getTopics);
router.put('/:id', updateTopic);
router.delete('/:id', deleteTopic);

module.exports = router;
