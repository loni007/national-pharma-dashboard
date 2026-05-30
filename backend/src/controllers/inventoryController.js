const inventoryService = require('../services/inventoryService');

function getInventory(req, res) {
  const inventory = inventoryService.getAllInventory();
  res.json(inventory);
}

function createMedicine(req, res) {
  const { name, category, quantity, expiryDate } = req.body;

  if (!name || !category || quantity === undefined || !expiryDate) {
    return res.status(400).json({
      message: "Name, category, quantity, and expiry date are required"
    });
  }

  if (quantity < 0) {
    return res.status(400).json({
      message: "Quantity cannot be negative"
    });
  }

  const newMedicine = inventoryService.addMedicine(req.body);
  res.status(201).json(newMedicine);
}

function updateMedicine(req, res) {
  if (req.body.quantity !== undefined && req.body.quantity < 0) {
    return res.status(400).json({
      message: "Quantity cannot be negative"
    });
  }

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