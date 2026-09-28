const express = require('express');
const { getLessonById } = require('../controllers/lessonController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/:id').get(getLessonById);

module.exports = router;