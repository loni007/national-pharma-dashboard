let shipments = [
  {
    id: 1,
    supplierId: 1,
    product: "Paracetamol",
    quantity: 500,
    status: "In Transit",
    destination: "Tetovo Warehouse"
  },
  {
    id: 2,
    supplierId: 2,
    product: "Amoxicillin",
    quantity: 300,
    status: "Pending",
    destination: "Skopje Warehouse"
  }
];

function getAllShipments() {
  return shipments;
}

function getShipmentById(id) {
  return shipments.find(shipment => shipment.id === Number(id));
}

function addShipment(shipment) {
  const newShipment = {
    id: shipments.length + 1,
    status: shipment.status || "Pending",
    ...shipment
  };

  shipments.push(newShipment);
  return newShipment;
}

function updateShipment(id, updatedData) {
  const shipment = shipments.find(item => item.id === Number(id));

  if (!shipment) {
    return null;
  }

  Object.assign(shipment, updatedData);
  return shipment;
}

function deleteShipment(id) {
  const index = shipments.findIndex(item => item.id === Number(id));

  if (index === -1) {
    return null;
  }

  const deletedShipment = shipments.splice(index, 1);
  return deletedShipment[0];
}

module.exports = {
  getAllShipments,
  getShipmentById,
  addShipment,
  updateShipment,
  deleteShipment
};