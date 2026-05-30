let inventory = [
  {
    id: 1,
    name: "Paracetamol",
    category: "Pain Relief",
    quantity: 120,
    expiryDate: "2026-05-15"
  },
  {
    id: 2,
    name: "Amoxicillin",
    category: "Antibiotic",
    quantity: 45,
    expiryDate: "2025-12-01"
  }
];

function getAllInventory() {
  return inventory;
}

function addMedicine(medicine) {
  const newMedicine = {
    id: inventory.length + 1,
    ...medicine
  };

  inventory.push(newMedicine);
  return newMedicine;
}

function updateMedicine(id, updatedData) {
  const medicine = inventory.find(item => item.id === Number(id));

  if (!medicine) {
    return null;
  }

  Object.assign(medicine, updatedData);
  return medicine;
}

function deleteMedicine(id) {
  const index = inventory.findIndex(item => item.id === Number(id));

  if (index === -1) {
    return null;
  }

  const deletedMedicine = inventory.splice(index, 1);
  return deletedMedicine[0];
}

module.exports = {
  getAllInventory,
  addMedicine,
  updateMedicine,
  deleteMedicine
};