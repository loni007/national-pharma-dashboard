const inventoryService = require('../services/inventoryService');

function getInventory(req, res) {
  const inventory = inventoryService.getAllInventory();
  res.json(inventory);
}

function createMedicine(req, res) {
  const newMedicine = inventoryService.addMedicine(req.body);
  res.status(201).json(newMedicine);
}

function updateMedicine(req, res) {
  const updatedMedicine = inventoryService.updateMedicine(req.params.id, req.body);

  if (!updatedMedicine) {
    return res.status(404).json({ message: "Medicine not found" });
  }

  res.json(updatedMedicine);
}

function deleteMedicine(req, res) {
  const deletedMedicine = inventoryService.deleteMedicine(req.params.id);

  if (!deletedMedicine) {
    return res.status(404).json({ message: "Medicine not found" });
  }

  res.json({
    message: "Medicine deleted successfully",
    medicine: deletedMedicine
  });
}

module.exports = {
  getInventory,
  createMedicine,
  updateMedicine,
  deleteMedicine
};