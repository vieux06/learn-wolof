const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit',
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  xpReward: {
    type: Number,
    default: 10
  },
  exercises: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Lesson', lessonSchema);