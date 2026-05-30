function getDashboardSummary() {
  return {
    totalMedicines: 24,
    totalSuppliers: 8,
    activeShipments: 5,
    lowStockItems: 3
  };
}

function getDemandPredictions() {
  return [
    {
      medicine: "Paracetamol",
      predictedDemandNextMonth: 1250,
      riskLevel: "High"
    },
    {
      medicine: "Amoxicillin",
      predictedDemandNextMonth: 780,
      riskLevel: "Medium"
    }
  ];
}

function getTrendGraphs() {
  return [
    {
      medicine: "Paracetamol",
      monthlyDemand: [900, 980, 1100, 1250]
    },
    {
      medicine: "Amoxicillin",
      monthlyDemand: [600, 650, 700, 780]
    }
  ];
}

function getReports() {
  return {
    reportTitle: "Pharmaceutical Warehouse Monthly Report",
    summary: "The system detected increasing demand for pain relief medicine and moderate demand growth for antibiotics."
  };
}

function getLowStockRisk() {
  return [
    {
      medicine: "Paracetamol",
      currentStock: 120,
      predictedDemand: 1250,
      risk: "High"
    },
    {
      medicine: "Ibuprofen",
      currentStock: 75,
      predictedDemand: 600,
      risk: "Medium"
    }
  ];
}

module.exports = {
  getDashboardSummary,
  getDemandPredictions,
  getTrendGraphs,
  getReports,
  getLowStockRisk
};