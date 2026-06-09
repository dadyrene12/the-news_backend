const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    enum: ['sidebar', 'banner', 'inline', 'leaderboard', 'after-menu', 'hero-banner', 'scrolling'],
    default: 'sidebar'
  },
  active: {
    type: Boolean,
    default: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    default: ''
  },
  scrollingText: {
    type: String,
    default: ''
  },
  htmlContent: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Advertisement', advertisementSchema);
