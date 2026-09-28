const Progress = require('../models/Progress');
const ExerciseAttempt = require('../models/ExerciseAttempt');
const Lesson = require('../models/Lesson');
const Exercise = require('../models/Exercise');
const User = require('../models/User');
const { getLearningLevels } = require('../utils/learningLevels');

const normalizeAnswer = (answer, correctAnswer) => {
  const values = Array.isArray(answer)
    ? answer
    : Array.isArray(correctAnswer)
      ? answer.split(',')
      : [answer];
  return values.map((value) =>
    typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('fr') : ''
  );
};

const getProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user._id,
      lesson: req.params.lessonId
    });

    res.json(progress || { completed: false, score: 0, completedExercises: [] });
  } catch (error) {
    console.error('Échec de la lecture de la progression :', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSummary = async (req, res) => {
  try {
    const [user, levels] = await Promise.all([
      User.findById(req.user._id).select('xp streak completedLessons'),
      getLearningLevels(req.user)
    ]);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const totalLessons = levels.reduce((total, level) => total + level.totalLessons, 0);
    const completedLessons = levels.reduce((total, level) => total + level.completedLessons, 0);
    const unlockedLevel = levels.filter((level) => level.unlocked).at(-1)?.level || 1;

    res.json({
      xp: user.xp,
      streak: user.streak,
      completedLessons,
      totalLessons,
      levels,
      unlockedLevel,
      level: Math.floor(user.xp / 100) + 1
    });
  } catch (error) {
    console.error('Échec de la lecture du résumé de progression :', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const markExerciseCompleted = async (userId, lesson, exerciseId) => {
  const progress = await Progress.findOneAndUpdate(
    { user: userId, lesson: lesson._id },
    { $setOnInsert: { user: userId, lesson: lesson._id } },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );

  const updatedProgress = await Progress.findOneAndUpdate(
    {
      _id: progress._id,
      completedExercises: { $ne: exerciseId }
    },
    {
      $addToSet: { completedExercises: exerciseId },
      $set: { lastAttempted: new Date() }
    },
    { returnDocument: 'after' }
  );
  const currentProgress = updatedProgress || progress;
  const lessonCompleted = lesson.exercises.every((id) =>
    currentProgress.completedExercises.some((completedId) => completedId.equals(id))
  );

  if (lessonCompleted) {
    await Progress.updateOne(
      { _id: progress._id },
      { $set: { completed: true, lastAttempted: new Date() } }
    );
    await User.updateOne(
      { _id: userId },
      { $addToSet: { completedLessons: lesson._id } }
    );
  }

  return { progress, lessonCompleted };
};

const submitAnswer = async (req, res) => {
  const { lessonId, exerciseId, answer } = req.body;

  if (
    typeof lessonId !== 'string' ||
    typeof exerciseId !== 'string' ||
    !(typeof answer === 'string' || Array.isArray(answer))
  ) {
    return res.status(400).json({ message: 'Lesson, exercise and answer are required' });
  }

  try {
    const [lesson, exercise] = await Promise.all([
      Lesson.findById(lessonId).select('exercises unit').populate('unit', 'level'),
      Exercise.findById(exerciseId).select('correctAnswer points')
    ]);

    if (!lesson || !exercise || !lesson.exercises.some((id) => id.equals(exercise._id))) {
      return res.status(404).json({ message: 'Lesson or exercise not found' });
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

    const answerIsCorrect =
      JSON.stringify(normalizeAnswer(answer, exercise.correctAnswer)) ===
      JSON.stringify(normalizeAnswer(exercise.correctAnswer, exercise.correctAnswer));

    if (!answerIsCorrect) {
      await ExerciseAttempt.findOneAndUpdate(
        {
          user: req.user._id,
          lesson: lesson._id,
          exercise: exercise._id
        },
        {
          $setOnInsert: {
            user: req.user._id,
            lesson: lesson._id,
            exercise: exercise._id
          }
        },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );

      const attempt = await ExerciseAttempt.findOneAndUpdate(
        {
          user: req.user._id,
          lesson: lesson._id,
          exercise: exercise._id,
          incorrectAttempts: { $lt: 2 },
          resolved: false
        },
        {
          $inc: { incorrectAttempts: 1 }
        },
        { returnDocument: 'after' }
      );

      const latestAttempt = attempt || await ExerciseAttempt.findOne({
        user: req.user._id,
        lesson: lesson._id,
        exercise: exercise._id
      });

      if (!latestAttempt) {
        throw new Error('Impossible de récupérer les tentatives de cet exercice.');
      }

      if (latestAttempt.incorrectAttempts >= 2) {
        let lessonCompleted;
        if (!latestAttempt.resolved) {
          latestAttempt.resolved = true;
          await latestAttempt.save();
          ({ lessonCompleted } = await markExerciseCompleted(req.user._id, lesson, exercise._id));
        }
        return res.json({
          correct: false,
          attempts: latestAttempt.incorrectAttempts,
          revealAnswer: true,
          correctAnswer: exercise.correctAnswer,
          xpAwarded: 0,
          lessonCompleted: Boolean(lessonCompleted)
        });
      }

      return res.json({
        correct: false,
        attempts: latestAttempt.incorrectAttempts,
        revealAnswer: latestAttempt.incorrectAttempts >= 2,
        xpAwarded: 0
      });
    }

    await ExerciseAttempt.findOneAndUpdate(
      {
        user: req.user._id,
        lesson: lesson._id,
        exercise: exercise._id
      },
      {
        $setOnInsert: {
          user: req.user._id,
          lesson: lesson._id,
          exercise: exercise._id
        },
        $set: { resolved: true }
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    const progress = await Progress.findOneAndUpdate(
      { user: req.user._id, lesson: lessonId },
      { $setOnInsert: { user: req.user._id, lesson: lessonId } },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    const updatedProgress = await Progress.findOneAndUpdate(
      {
        _id: progress._id,
        completedExercises: { $ne: exercise._id }
      },
      {
        $addToSet: { completedExercises: exercise._id },
        $inc: { score: exercise.points },
        $set: { lastAttempted: new Date() }
      },
      { returnDocument: 'after' }
    );

    const xpAwarded = updatedProgress ? exercise.points : 0;
    let user;
    if (updatedProgress) {
      const currentUser = await User.findById(req.user._id).select('streak lastActive');
      if (!currentUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      const today = new Date();
      const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
      const lastActive = currentUser.lastActive;
      const lastActiveUtc = lastActive
        ? Date.UTC(lastActive.getUTCFullYear(), lastActive.getUTCMonth(), lastActive.getUTCDate())
        : 0;
      const daysSinceLastActivity = Math.floor((todayUtc - lastActiveUtc) / 86_400_000);
      const streak =
        currentUser.streak === 0 || daysSinceLastActivity > 1
          ? 1
          : daysSinceLastActivity === 1
            ? currentUser.streak + 1
            : currentUser.streak;

      user = await User.findByIdAndUpdate(
        req.user._id,
        {
          $inc: { xp: xpAwarded },
          $set: { streak, lastActive: today }
        },
        { returnDocument: 'after' }
      ).select('xp completedLessons');
    } else {
      user = await User.findById(req.user._id).select('xp completedLessons');
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const allExercisesCompleted = lesson.exercises.every((id) =>
      (updatedProgress || progress).completedExercises.some((completedId) => completedId.equals(id))
    );

    if (allExercisesCompleted) {
      await Progress.updateOne(
        { _id: progress._id },
        { $set: { completed: true, lastAttempted: new Date() } }
      );
      await User.updateOne(
        { _id: req.user._id },
        { $addToSet: { completedLessons: lesson._id } }
      );
    }

    res.json({
      correct: true,
      xpAwarded,
      totalXp: user.xp,
      lessonCompleted: allExercisesCompleted,
      completedExercises: (updatedProgress || progress).completedExercises
    });
  } catch (error) {
    console.error('Échec de l’enregistrement de la réponse :', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProgress, getSummary, submitAnswer };
