const fs = require("fs");
const path = require("path");

const inventoryService = require("./inventoryService");
const supplierService = require("./supplierService");
const shipmentService = require("./shipmentService");

const predictionsPath = path.join(
  __dirname,
  "../../../ml/data/predictions.json"
);

function readPredictionOutput() {
  try {
    const rawData = fs.readFileSync(predictionsPath, "utf-8");
    return JSON.parse(rawData);
  } catch (error) {
    return {
      predictions: [],
      lowStockRisk: [],
    };
  }
}

function getDashboardSummary() {
  const inventory = inventoryService.getAllInventory();
  const suppliers = supplierService.getAllSuppliers();
  const shipments = shipmentService.getAllShipments();
  const predictionOutput = readPredictionOutput();

  const activeShipments = shipments.filter(
    (shipment) => shipment.status !== "Delivered"
  );

  const lowStockItems = predictionOutput.lowStockRisk.filter(
    (item) => item.risk === "High" || item.risk === "Medium"
  );

  return {
    totalMedicines: inventory.length,
    totalSuppliers: suppliers.length,
    activeShipments: activeShipments.length,
    lowStockItems: lowStockItems.length,
  };
}

function getDemandPredictions() {
  const output = readPredictionOutput();
  return output.predictions;
}

function getTrendGraphs() {
  return [
    {
      medicine: "Paracetamol",
      monthlyDemand: [900, 980, 1100, 1250],
    },
    {
      medicine: "Amoxicillin",
      monthlyDemand: [600, 650, 700, 780],
    },
    {
      medicine: "Ibuprofen",
      monthlyDemand: [700, 760, 830, 980],
    },
  ];
}

function getReports() {
  const predictionOutput = readPredictionOutput();

  const highRiskItems = predictionOutput.lowStockRisk.filter(
    (item) => item.risk === "High"
  );

  return {
    reportTitle: "Pharmaceutical Warehouse Monthly Report",
    summary:
      highRiskItems.length > 0
        ? `The system detected ${highRiskItems.length} high-risk medicine demand signal(s). Immediate review of stock levels is recommended.`
        : "The system detected stable medicine demand patterns with no high-risk shortage alerts.",
  };
}

function getLowStockRisk() {
  const output = readPredictionOutput();
  return output.lowStockRisk;
}

module.exports = {
  getDashboardSummary,
  getDemandPredictions,
  getTrendGraphs,
  getReports,
  getLowStockRisk,
};