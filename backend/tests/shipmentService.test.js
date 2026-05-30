const shipmentService = require('../src/services/shipmentService');

test('should return all shipments', () => {
  const shipments = shipmentService.getAllShipments();

  expect(Array.isArray(shipments)).toBe(true);
  expect(shipments.length).toBeGreaterThan(0);
});

test('should return shipment by id', () => {
  const shipment = shipmentService.getShipmentById(1);

  expect(shipment).not.toBeNull();
  expect(shipment.id).toBe(1);
});

test('should add a new shipment', () => {
  const shipment = shipmentService.addShipment({
    supplierId: 1,
    product: "Test Medicine",
    quantity: 100,
    status: "Pending",
    destination: "Test Warehouse"
  });

  expect(shipment).toHaveProperty('id');
  expect(shipment.product).toBe("Test Medicine");
});

test('should update shipment status', () => {
  const updatedShipment = shipmentService.updateShipment(1, {
    status: "Delivered"
  });

  expect(updatedShipment).not.toBeNull();
  expect(updatedShipment.status).toBe("Delivered");
});

test('should delete an existing shipment', () => {
  const deletedShipment = shipmentService.deleteShipment(2);

  expect(deletedShipment).not.toBeNull();
  expect(deletedShipment.id).toBe(2);
});

test('should return null when updating non-existing shipment', () => {
  const result = shipmentService.updateShipment(999, {
    status: 'Delivered'
  });

  expect(result).toBeNull();
});

test('should return null when deleting non-existing shipment', () => {
  const result = shipmentService.deleteShipment(999);

  expect(result).toBeNull();
});