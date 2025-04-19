const Theme = require('../models/Theme');
const asyncHandler = require('express-async-handler');

// @desc    Get all system themes
// @route   GET /api/theme/system
// @access  Public
const getSystemThemes = asyncHandler(async (req, res) => {
  const themes = await Theme.find({ isSystemTheme: true });
  res.json(themes);
});

// @desc    Get theme by ID
// @route   GET /api/theme/:id
// @access  Public
const getThemeById = asyncHandler(async (req, res) => {
  const theme = await Theme.findById(req.params.id);
  
  if (!theme) {
    res.status(404);
    throw new Error('Theme not found');
  }

  res.json(theme);
});

// @desc    Create custom theme
// @route   POST /api/theme/custom
// @access  Private
const createCustomTheme = asyncHandler(async (req, res) => {
  const { name, description, colors, fonts } = req.body;

  const theme = new Theme({
    name,
    description,
    colors,
    fonts,
    isSystemTheme: false,
    createdBy: req.user._id
  });

  const createdTheme = await theme.save();
  res.status(201).json(createdTheme);
});

module.exports = {
  getSystemThemes,
  getThemeById,
  createCustomTheme
};