const express = require('express');
const router = express.Router();
const caseStudyController = require('../controllers/caseStudyController');
const { protect } = require('../middleware/auth');

router.get('/portfolio/:username', caseStudyController.getPublicCaseStudies);
router.get('/me', protect, caseStudyController.getMyCaseStudies);
router.get('/:id', protect, caseStudyController.getCaseStudy);
router.post('/', protect, caseStudyController.createCaseStudy);
router.put('/:id', protect, caseStudyController.updateCaseStudy);
router.delete('/:id', protect, caseStudyController.deleteCaseStudy);
router.put('/reorder', protect, caseStudyController.reorderCaseStudies);

module.exports = router;