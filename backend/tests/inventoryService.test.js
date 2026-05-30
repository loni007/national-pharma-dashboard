const inventoryService = require('../src/services/inventoryService');

test('should return all inventory items', () => {
  const inventory = inventoryService.getAllInventory();

  expect(Array.isArray(inventory)).toBe(true);
  expect(inventory.length).toBeGreaterThan(0);
});

test('should add a new medicine', () => {
  const medicine = inventoryService.addMedicine({
    name: "Aspirin",
    category: "Pain Relief",
    quantity: 50,
    expiryDate: "2027-06-01"
  });

  expect(medicine).toHaveProperty('id');
  expect(medicine.name).toBe("Aspirin");
  expect(medicine.quantity).toBe(50);
});

test('should update an existing medicine', () => {
  const updatedMedicine = inventoryService.updateMedicine(1, {
    quantity: 200
  });

  expect(updatedMedicine).not.toBeNull();
  expect(updatedMedicine.quantity).toBe(200);
});

test('should delete an existing medicine', () => {
  const deletedMedicine = inventoryService.deleteMedicine(2);

  expect(deletedMedicine).not.toBeNull();
  expect(deletedMedicine.id).toBe(2);
});

test('should return null when updating non-existing medicine', () => {
  const result = inventoryService.updateMedicine(999, {
    quantity: 100
  });

  expect(result).toBeNull();
});

test('should return null when deleting non-existing medicine', () => {
  const result = inventoryService.deleteMedicine(999);

  expect(result).toBeNull();
});