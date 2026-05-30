const express = require('express');

const app = express();

app.use(express.json());

const inventoryRoutes = require('./routes/inventoryRoutes');

app.use('/', inventoryRoutes);

module.exports = app;