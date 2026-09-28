const Unit = require('../models/Unit');
const Lesson = require('../models/Lesson');
const { getLearningLevels } = require('../utils/learningLevels');

// @desc    Get all units
// @route   GET /api/units
// @access  Private
const getUnits = async (req, res) => {
  try {
    const [units, levels] = await Promise.all([
      Unit.find({}).sort({ order: 1 }),
      getLearningLevels(req.user)
    ]);
    const levelStatus = new Map(levels.map((level) => [level.level, level]));

    res.json(units.map((unit) => ({
      ...unit.toObject(),
      isLocked: !levelStatus.get(unit.level)?.unlocked,
      requiredPreviousLessons: levelStatus.get(unit.level)?.requiredPreviousLessons || 0,
      completedPreviousLessons: levelStatus.get(unit.level)?.completedPreviousLessons || 0
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get unit by ID with lessons
// @route   GET /api/units/:id
// @access  Private
const getUnitById = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id).populate({
      path: 'lessons',
      select: 'title description order xpReward',
      options: { sort: { order: 1 } }
    });

    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }

    const levelStatus = (await getLearningLevels(req.user)).find(
      (level) => level.level === unit.level
    );
    if (levelStatus && !levelStatus.unlocked) {
      return res.status(403).json({
        message: 'Complete the previous level to unlock this unit',
        requiredPreviousLessons: levelStatus.requiredPreviousLessons,
        completedPreviousLessons: levelStatus.completedPreviousLessons
      });
    }

    res.json(unit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUnits, getUnitById };