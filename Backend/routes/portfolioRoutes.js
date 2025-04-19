const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const { protect } = require('../middleware/auth');

router.get('/:username', portfolioController.getPortfolioByUsername);
router.get('/me', protect, portfolioController.getMyPortfolio);
router.post('/', protect, portfolioController.createUpdatePortfolio);
router.get('/check-username/:username', protect, portfolioController.checkUsernameAvailability);
router.put('/username', protect, portfolioController.updateUsername);

module.exports = router;