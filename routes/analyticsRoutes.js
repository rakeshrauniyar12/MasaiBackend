const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.post('/track-view', analyticsController.trackView);
router.post('/track-click', analyticsController.trackClick);
router.get('/portfolio', protect, analyticsController.getPortfolioAnalytics);

module.exports = router;