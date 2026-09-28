const Unit = require('../models/Unit');

const getLearningLevels = async (user) => {
  const units = await Unit.find().select('level lessons').sort({ level: 1, order: 1 });
  const completedIds = new Set((user.completedLessons || []).map((id) => id.toString()));
  const levelNumbers = [...new Set(units.map((unit) => unit.level))].sort((a, b) => a - b);
  const completedByLevel = new Map();

  for (const level of levelNumbers) {
    const lessonIds = units
      .filter((unit) => unit.level === level)
      .flatMap((unit) => unit.lessons);
    completedByLevel.set(level, lessonIds.filter((id) => completedIds.has(id.toString())).length);
  }

  return levelNumbers.map((level, index) => {
    const previousLessonIds = units
      .filter((unit) => unit.level < level)
      .flatMap((unit) => unit.lessons);
    const completedPreviousLessons = previousLessonIds.filter((id) =>
      completedIds.has(id.toString())
    ).length;

    return {
      level,
      totalLessons: units
        .filter((unit) => unit.level === level)
        .reduce((total, unit) => total + unit.lessons.length, 0),
      completedLessons: completedByLevel.get(level),
      requiredPreviousLessons: previousLessonIds.length,
      completedPreviousLessons,
      unlocked:
        index === 0 ||
        (previousLessonIds.length > 0 &&
          completedPreviousLessons === previousLessonIds.length)
    };
  });
};

module.exports = { getLearningLevels };
