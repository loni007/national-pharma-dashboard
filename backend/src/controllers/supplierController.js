const supplierService = require('../services/supplierService');

function getSuppliers(req, res) {
  const suppliers = supplierService.getAllSuppliers();
  res.json(suppliers);
}

function createSupplier(req, res) {
  const { name, contactEmail, phone, country } = req.body;

  if (!name || !contactEmail || !phone || !country) {
    return res.status(400).json({
      message: "Name, contact email, phone, and country are required"
    });
  }

  const newSupplier = supplierService.addSupplier(req.body);
  res.status(201).json(newSupplier);
}

function updateSupplier(req, res) {
  const updatedSupplier = supplierService.updateSupplier(req.params.id, req.body);

  if (!updatedSupplier) {
    return res.status(404).json({ message: "Supplier not found" });
  }

  res.json(updatedSupplier);
}

function deleteSupplier(req, res) {
  const deletedSupplier = supplierService.deleteSupplier(req.params.id);

  if (!deletedSupplier) {
    return res.status(404).json({ message: "Supplier not found" });
  }

  res.json({
    message: "Supplier deleted successfully",
    supplier: deletedSupplier
  });
}

module.exports = {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
};