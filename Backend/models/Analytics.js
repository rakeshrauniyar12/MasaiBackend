const mongoose = require('mongoose');

const PageViewSchema = new mongoose.Schema({
  portfolio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
    required: true
  },
  caseStudy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CaseStudy'
  },
  ipAddress: String,
  userAgent: String,
  referrer: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ClickEventSchema = new mongoose.Schema({
  portfolio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
    required: true
  },
  caseStudy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CaseStudy'
  },
  elementId: String,
  elementType: String,
  ipAddress: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const AnalyticsSchema = new mongoose.Schema({
  portfolio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
    required: true,
    unique: true
  },
  totalViews: {
    type: Number,
    default: 0
  },
  caseStudyViews: [{
    caseStudy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CaseStudy'
    },
    views: {
      type: Number,
      default: 0
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const PageView = mongoose.model('PageView', PageViewSchema);
const ClickEvent = mongoose.model('ClickEvent', ClickEventSchema);
const Analytics = mongoose.model('Analytics', AnalyticsSchema);

module.exports = { PageView, ClickEvent, Analytics };