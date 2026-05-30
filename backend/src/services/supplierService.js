let suppliers = [
  {
    id: 1,
    name: "PharmaMed Supply",
    contactEmail: "contact@pharmamed.com",
    phone: "+38970111222",
    country: "North Macedonia"
  },
  {
    id: 2,
    name: "Balkan Pharma Distribution",
    contactEmail: "info@balkanpharma.com",
    phone: "+38970222333",
    country: "North Macedonia"
  }
];

function getAllSuppliers() {
  return suppliers;
}

function addSupplier(supplier) {
  const newSupplier = {
    id: suppliers.length + 1,
    ...supplier
  };

  suppliers.push(newSupplier);
  return newSupplier;
}

function updateSupplier(id, updatedData) {
  const supplier = suppliers.find(item => item.id === Number(id));

  if (!supplier) {
    return null;
  }

  Object.assign(supplier, updatedData);
  return supplier;
}

function deleteSupplier(id) {
  const index = suppliers.findIndex(item => item.id === Number(id));

  if (index === -1) {
    return null;
  }

  const deletedSupplier = suppliers.splice(index, 1);
  return deletedSupplier[0];
}

module.exports = {
  getAllSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier
};