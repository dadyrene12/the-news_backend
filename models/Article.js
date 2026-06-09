const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  excerpt: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    default: 'Admin'
  },
  image: {
    type: String,
    default: ''
  },
  relatedImages: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  breaking: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  link: {
    type: String,
    default: ''
  },
  source: {
    type: String,
    enum: ['igihe', 'BBC', 'bbc', 'the news', 'the-news', 'manual', ''],
    default: 'manual'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Article', articleSchema);
