const express = require('express');
const router = express.Router();

const analyticsController = require('../controllers/analyticsController');

router.get('/analytics/dashboard', analyticsController.getDashboard);
router.get('/analytics/predictions', analyticsController.getPredictions);
router.get('/analytics/trends', analyticsController.getTrends);
router.get('/analytics/reports', analyticsController.getReports);
router.get('/analytics/low-stock-risk', analyticsController.getLowStockRisk);

module.exports = router;