const supplierService = require('../src/services/supplierService');

test('should return all suppliers', () => {
  const suppliers = supplierService.getAllSuppliers();

  expect(Array.isArray(suppliers)).toBe(true);
  expect(suppliers.length).toBeGreaterThan(0);
});

test('should add a new supplier', () => {
  const supplier = supplierService.addSupplier({
    name: "Test Pharma Supplier",
    contactEmail: "test@supplier.com",
    phone: "+38970123456",
    country: "North Macedonia"
  });

  expect(supplier).toHaveProperty('id');
  expect(supplier.name).toBe("Test Pharma Supplier");
});

test('should update an existing supplier', () => {
  const updatedSupplier = supplierService.updateSupplier(1, {
    country: "Spain"
  });

  expect(updatedSupplier).not.toBeNull();
  expect(updatedSupplier.country).toBe("Spain");
});

test('should delete an existing supplier', () => {
  const deletedSupplier = supplierService.deleteSupplier(2);

  expect(deletedSupplier).not.toBeNull();
  expect(deletedSupplier.id).toBe(2);
});