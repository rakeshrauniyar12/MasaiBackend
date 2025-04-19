const express = require('express');
const router = express.Router();
const themeController = require('../controllers/themeController');
const { protect } = require('../middleware/auth');

router.get('/system', themeController.getSystemThemes);
router.get('/:id', themeController.getThemeById);
router.post('/custom', protect, themeController.createCustomTheme);

module.exports = router;