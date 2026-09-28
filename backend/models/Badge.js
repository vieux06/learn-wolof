const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  icon: {
    type: String, // URL or emoji
    default: '🏆'
  },
  criteria: {
    type: mongoose.Schema.Types.Mixed, // e.g., { lessonsCompleted: 5, streak: 7 }
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Badge', badgeSchema);