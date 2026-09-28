const mongoose = require('mongoose');

const exerciseAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  incorrectAttempts: {
    type: Number,
    default: 0,
    min: 0,
    max: 2
  },
  resolved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

exerciseAttemptSchema.index({ user: 1, lesson: 1, exercise: 1 }, { unique: true });

module.exports = mongoose.model('ExerciseAttempt', exerciseAttemptSchema);
