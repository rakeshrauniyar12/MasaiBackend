const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get portfolio by username
// @route   GET /api/portfolio/:username
// @access  Public
const getPortfolioByUsername = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findOne({ username: req.params.username })
    .populate('selectedTheme')
    .populate('user', 'username email');

  if (!portfolio || !portfolio.published) {
    res.status(404);
    throw new Error('Portfolio not found');
  }

  res.json(portfolio);
});

// @desc    Get user's portfolio (for editing)
// @route   GET /api/portfolio/me
// @access  Private
const getMyPortfolio = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findOne({ user: req.user._id })
    .populate('selectedTheme');

  if (!portfolio) {
    res.status(404);
    throw new Error('Portfolio not found');
  }

  res.json(portfolio);
});

// @desc    Create or update portfolio
// @route   POST /api/portfolio
// @access  Private
const createUpdatePortfolio = asyncHandler(async (req, res) => {
  const { title, bio, skills, socialLinks, selectedTheme, customTheme, published } = req.body;

  let portfolio = await Portfolio.findOne({ user: req.user._id });

  if (!portfolio) {
    // Create new portfolio
    portfolio = new Portfolio({
      user: req.user._id,
      username: req.user.username,
      title,
      bio,
      skills,
      socialLinks,
      selectedTheme,
      customTheme,
      published
    });
  } else {
    // Update existing portfolio
    portfolio.title = title || portfolio.title;
    portfolio.bio = bio || portfolio.bio;
    portfolio.skills = skills || portfolio.skills;
    portfolio.socialLinks = socialLinks || portfolio.socialLinks;
    portfolio.selectedTheme = selectedTheme || portfolio.selectedTheme;
    portfolio.customTheme = customTheme || portfolio.customTheme;
    portfolio.published = published !== undefined ? published : portfolio.published;
    portfolio.updatedAt = new Date();
  }

  const savedPortfolio = await portfolio.save();
  res.status(201).json(savedPortfolio);
});

// @desc    Check username availability
// @route   GET /api/portfolio/check-username/:username
// @access  Private
const checkUsernameAvailability = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findOne({ username: req.params.username });
  
  if (portfolio) {
    res.json({ available: false });
  } else {
    res.json({ available: true });
  }
});

// @desc    Update username
// @route   PUT /api/portfolio/username
// @access  Private
const updateUsername = asyncHandler(async (req, res) => {
  const { username } = req.body;

  // Check if username is available
  const existingPortfolio = await Portfolio.findOne({ username });
  if (existingPortfolio) {
    res.status(400);
    throw new Error('Username is already taken');
  }

  const portfolio = await Portfolio.findOneAndUpdate(
    { user: req.user._id },
    { username },
    { new: true }
  );

  if (!portfolio) {
    res.status(404);
    throw new Error('Portfolio not found');
  }

  res.json(portfolio);
});

module.exports = {
  getPortfolioByUsername,
  getMyPortfolio,
  createUpdatePortfolio,
  checkUsernameAvailability,
  updateUsername
};