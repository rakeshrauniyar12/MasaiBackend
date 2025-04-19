const mongoose = require('mongoose');

const MediaItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['image', 'video', 'embed'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  caption: String,
  order: Number
});

const TimelineItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  date: Date,
  order: Number
});

const CaseStudySchema = new mongoose.Schema({
  portfolio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  overview: {
    type: String,
    required: true
  },
  problemStatement: String,
  solution: String,
  mediaGallery: [MediaItemSchema],
  timeline: [TimelineItemSchema],
  toolsTechnologies: [String],
  outcomes: {
    metrics: [{
      name: String,
      value: String
    }],
    testimonials: [{
      name: String,
      role: String,
      quote: String
    }]
  },
  published: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CaseStudy', CaseStudySchema);