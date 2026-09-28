const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    required: true
  },
  level: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Unit', unitSchema);