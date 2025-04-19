const { Analytics, PageView, ClickEvent } = require('../models/Analytics');
const Portfolio = require('../models/Portfolio');
const asyncHandler = require('express-async-handler');

// @desc    Track portfolio view
// @route   POST /api/analytics/track-view
// @access  Public
const trackView = asyncHandler(async (req, res) => {
  const { portfolioId, caseStudyId } = req.body;

  const portfolio = await Portfolio.findById(portfolioId);
  if (!portfolio || !portfolio.published) {
    res.status(404);
    throw new Error('Portfolio not found');
  }

  // Record page view
  const pageView = new PageView({
    portfolio: portfolioId,
    caseStudy: caseStudyId,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
    referrer: req.get('Referrer')
  });
  await pageView.save();

  // Update analytics summary
  await Analytics.findOneAndUpdate(
    { portfolio: portfolioId },
    {
      $inc: { totalViews: 1 },
      $set: { lastUpdated: new Date() }
    },
    { upsert: true, new: true }
  );

  if (caseStudyId) {
    await Analytics.findOneAndUpdate(
      { portfolio: portfolioId, 'caseStudyViews.caseStudy': caseStudyId },
      {
        $inc: { 'caseStudyViews.$.views': 1 }
      }
    );
  }

  res.status(200).json({ success: true });
});

// @desc    Track click event
// @route   POST /api/analytics/track-click
// @access  Public
const trackClick = asyncHandler(async (req, res) => {
  const { portfolioId, caseStudyId, elementId, elementType } = req.body;

  const clickEvent = new ClickEvent({
    portfolio: portfolioId,
    caseStudy: caseStudyId,
    elementId,
    elementType,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  await clickEvent.save();
  res.status(200).json({ success: true });
});

// @desc    Get portfolio analytics
// @route   GET /api/analytics/portfolio
// @access  Private
const getPortfolioAnalytics = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findOne({ user: req.user._id });
  
  if (!portfolio) {
    res.status(404);
    throw new Error('Portfolio not found');
  }

  const analytics = await Analytics.findOne({ portfolio: portfolio._id })
    .populate({
      path: 'caseStudyViews.caseStudy',
      select: 'title slug'
    });

  // Get recent page views
  const recentViews = await PageView.find({ portfolio: portfolio._id })
    .sort('-timestamp')
    .limit(10)
    .populate('caseStudy', 'title slug');

  // Get popular case studies
  const popularCaseStudies = await Analytics.aggregate([
    { $match: { portfolio: portfolio._id } },
    { $unwind: '$caseStudyViews' },
    { $sort: { 'caseStudyViews.views': -1 } },
    { $limit: 5 },
    { $project: { caseStudyViews: 1 } }
  ]);

  res.json({
    summary: analytics,
    recentViews,
    popularCaseStudies: popularCaseStudies.map(item => item.caseStudyViews)
  });
});

module.exports = {
  trackView,
  trackClick,
  getPortfolioAnalytics
};