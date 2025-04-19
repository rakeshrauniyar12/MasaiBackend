const CaseStudy = require('../models/CaseStudy');
const Portfolio = require('../models/Portfolio');
const asyncHandler = require('express-async-handler');

// @desc    Get all case studies for a portfolio (public)
// @route   GET /api/case-study/portfolio/:username
// @access  Public
const getPublicCaseStudies = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findOne({ username: req.params.username });
  
  if (!portfolio || !portfolio.published) {
    res.status(404);
    throw new Error('Portfolio not found');
  }

  const caseStudies = await CaseStudy.find({ 
    portfolio: portfolio._id,
    published: true
  }).sort('order');

  res.json(caseStudies);
});

// @desc    Get all case studies for logged in user
// @route   GET /api/case-study/me
// @access  Private
const getMyCaseStudies = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findOne({ user: req.user._id });
  
  if (!portfolio) {
    res.status(404);
    throw new Error('Portfolio not found');
  }

  const caseStudies = await CaseStudy.find({ portfolio: portfolio._id }).sort('order');
  res.json(caseStudies);
});

// @desc    Get single case study
// @route   GET /api/case-study/:id
// @access  Private
const getCaseStudy = asyncHandler(async (req, res) => {
  const caseStudy = await CaseStudy.findById(req.params.id);

  if (!caseStudy) {
    res.status(404);
    throw new Error('Case study not found');
  }

  // Verify the case study belongs to the user's portfolio
  const portfolio = await Portfolio.findOne({ user: req.user._id });
  if (!portfolio || !caseStudy.portfolio.equals(portfolio._id)) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.json(caseStudy);
});

// @desc    Create case study
// @route   POST /api/case-study
// @access  Private
const createCaseStudy = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findOne({ user: req.user._id });
  
  if (!portfolio) {
    res.status(404);
    throw new Error('Portfolio not found');
  }

  const { title, slug } = req.body;

  // Check if slug is unique for this portfolio
  const existingCaseStudy = await CaseStudy.findOne({ 
    portfolio: portfolio._id,
    slug
  });

  if (existingCaseStudy) {
    res.status(400);
    throw new Error('Slug must be unique within your portfolio');
  }

  const caseStudy = new CaseStudy({
    portfolio: portfolio._id,
    ...req.body
  });

  const createdCaseStudy = await caseStudy.save();
  res.status(201).json(createdCaseStudy);
});

// @desc    Update case study
// @route   PUT /api/case-study/:id
// @access  Private
const updateCaseStudy = asyncHandler(async (req, res) => {
  const caseStudy = await CaseStudy.findById(req.params.id);

  if (!caseStudy) {
    res.status(404);
    throw new Error('Case study not found');
  }

  // Verify the case study belongs to the user's portfolio
  const portfolio = await Portfolio.findOne({ user: req.user._id });
  if (!portfolio || !caseStudy.portfolio.equals(portfolio._id)) {
    res.status(401);
    throw new Error('Not authorized');
  }

  // Check if slug is being updated and is unique
  if (req.body.slug && req.body.slug !== caseStudy.slug) {
    const existingCaseStudy = await CaseStudy.findOne({ 
      portfolio: portfolio._id,
      slug: req.body.slug
    });

    if (existingCaseStudy) {
      res.status(400);
      throw new Error('Slug must be unique within your portfolio');
    }
  }

  Object.assign(caseStudy, req.body);
  caseStudy.updatedAt = new Date();

  const updatedCaseStudy = await caseStudy.save();
  res.json(updatedCaseStudy);
});

// @desc    Delete case study
// @route   DELETE /api/case-study/:id
// @access  Private
const deleteCaseStudy = asyncHandler(async (req, res) => {
  const caseStudy = await CaseStudy.findById(req.params.id);

  if (!caseStudy) {
    res.status(404);
    throw new Error('Case study not found');
  }

  // Verify the case study belongs to the user's portfolio
  const portfolio = await Portfolio.findOne({ user: req.user._id });
  if (!portfolio || !caseStudy.portfolio.equals(portfolio._id)) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await caseStudy.remove();
  res.json({ message: 'Case study removed' });
});

// @desc    Reorder case studies
// @route   PUT /api/case-study/reorder
// @access  Private
const reorderCaseStudies = asyncHandler(async (req, res) => {
  const { order } = req.body;
  const portfolio = await Portfolio.findOne({ user: req.user._id });
  
  if (!portfolio) {
    res.status(404);
    throw new Error('Portfolio not found');
  }

  const bulkOps = order.map((id, index) => ({
    updateOne: {
      filter: { _id: id, portfolio: portfolio._id },
      update: { $set: { order: index } }
    }
  }));

  await CaseStudy.bulkWrite(bulkOps);
  res.json({ message: 'Case studies reordered' });
});

module.exports = {
  getPublicCaseStudies,
  getMyCaseStudies,
  getCaseStudy,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
  reorderCaseStudies
};