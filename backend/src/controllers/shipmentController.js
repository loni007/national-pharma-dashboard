const shipmentService = require('../services/shipmentService');

function getShipments(req, res) {
  const shipments = shipmentService.getAllShipments();
  res.json(shipments);
}

function getShipment(req, res) {
  const shipment = shipmentService.getShipmentById(req.params.id);

  if (!shipment) {
    return res.status(404).json({ message: "Shipment not found" });
  }

  res.json(shipment);
}

function createShipment(req, res) {
  const { supplierId, product, quantity, destination } = req.body;

  if (!supplierId || !product || quantity === undefined || !destination) {
    return res.status(400).json({
      message: "Supplier ID, product, quantity, and destination are required"
    });
  }

  if (quantity < 0) {
    return res.status(400).json({
      message: "Quantity cannot be negative"
    });
  }

  const newShipment = shipmentService.addShipment(req.body);
  res.status(201).json(newShipment);
}

function updateShipment(req, res) {
  if (req.body.quantity !== undefined && req.body.quantity < 0) {
    return res.status(400).json({
      message: "Quantity cannot be negative"
    });
  }

  const updatedShipment = shipmentService.updateShipment(req.params.id, req.body);

  if (!updatedShipment) {
    return res.status(404).json({ message: "Shipment not found" });
  }

  res.json(updatedShipment);
}

function deleteShipment(req, res) {
  const deletedShipment = shipmentService.deleteShipment(req.params.id);

  if (!deletedShipment) {
    return res.status(404).json({ message: "Shipment not found" });
  }

  res.json({
    message: "Shipment deleted successfully",
    shipment: deletedShipment
  });
}

module.exports = {
  getShipments,
  getShipment,
  createShipment,
  updateShipment,
  deleteShipment
};