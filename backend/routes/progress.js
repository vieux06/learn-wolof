const express = require('express');
const { getProgress, getSummary, submitAnswer } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/summary').get(getSummary);
router.route('/answer').post(submitAnswer);
router.route('/:lessonId').get(getProgress);

module.exports = router;