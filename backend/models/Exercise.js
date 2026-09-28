const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['translation', 'multiple_choice', 'ordering', 'fill_in_the_blank', 'matching', 'listening', 'pronunciation', 'dialogue']
  },
  question: {
    type: String,
    required: true
  },
  seedKey: {
    type: String,
    unique: true,
    sparse: true
  },
  options: [String], // for multiple choice, matching, etc.
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed, // could be String or Array depending on type
    required: true
  },
  audioUrl: {
    type: String
  },
  listenText: {
    type: String,
    trim: true
  },
  answerLanguage: {
    type: String,
    default: 'fr-FR'
  },
  imageUrl: {
    type: String
  },
  points: {
    type: Number,
    default: 5
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Exercise', exerciseSchema);