const Lesson = require('../models/Lesson');
const { getLearningLevels } = require('../utils/learningLevels');

// @desc    Get lesson by ID with exercises
// @route   GET /api/lessons/:id
// @access  Private
const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate({
        path: 'exercises',
        select: 'type question options audioUrl imageUrl listenText answerLanguage points',
        options: { sort: { _id: 1 } }
      })
      .populate({
        path: 'unit',
        select: 'title level'
      });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const levelStatus = (await getLearningLevels(req.user)).find(
      (level) => level.level === lesson.unit.level
    );
    if (levelStatus && !levelStatus.unlocked) {
      return res.status(403).json({
        message: 'Complete the previous level to unlock this lesson',
        requiredPreviousLessons: levelStatus.requiredPreviousLessons,
        completedPreviousLessons: levelStatus.completedPreviousLessons
      });
    }

    res.json(lesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getLessonById };