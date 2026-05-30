const express = require('express');
const router = express.Router();

const inventoryController = require('../controllers/inventoryController');

router.get('/inventory', inventoryController.getInventory);
router.post('/inventory', inventoryController.createMedicine);
router.put('/inventory/:id', inventoryController.updateMedicine);
router.delete('/inventory/:id', inventoryController.deleteMedicine);

module.exports = router;