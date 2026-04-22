const express = require('express');
const { getSchedule, generateSchedule, updateBlock } = require('../controllers/schedule.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', getSchedule);
router.post('/generate', generateSchedule);
router.patch('/block/:blockId', updateBlock);

module.exports = router;
