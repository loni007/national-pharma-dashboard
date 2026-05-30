const express = require('express');

const app = express();

app.use(express.json());

const inventoryRoutes = require('./routes/inventoryRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const shipmentRoutes = require('./routes/shipmentRoutes');

app.use('/', inventoryRoutes);
app.use('/', supplierRoutes);
app.use('/', shipmentRoutes);

module.exports = app;