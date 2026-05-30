const analyticsService = require('../services/analyticsService');

function getDashboard(req, res) {
  res.json(analyticsService.getDashboardSummary());
}

function getPredictions(req, res) {
  res.json(analyticsService.getDemandPredictions());
}

function getTrends(req, res) {
  res.json(analyticsService.getTrendGraphs());
}

function getReports(req, res) {
  res.json(analyticsService.getReports());
}

function getLowStockRisk(req, res) {
  res.json(analyticsService.getLowStockRisk());
}

module.exports = {
  getDashboard,
  getPredictions,
  getTrends,
  getReports,
  getLowStockRisk
};