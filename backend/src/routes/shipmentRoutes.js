const express = require('express');
const router = express.Router();

const shipmentController = require('../controllers/shipmentController');

router.get('/shipments', shipmentController.getShipments);
router.get('/shipments/:id', shipmentController.getShipment);
router.post('/shipments', shipmentController.createShipment);
router.put('/shipments/:id', shipmentController.updateShipment);
router.delete('/shipments/:id', shipmentController.deleteShipment);

module.exports = router;