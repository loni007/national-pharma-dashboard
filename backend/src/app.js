const express = require('express');

const app = express();

app.use(express.json());

const inventoryRoutes = require('./routes/inventoryRoutes');
const supplierRoutes = require('./routes/supplierRoutes');

app.use('/', inventoryRoutes);
app.use('/', supplierRoutes);

module.exports = app;