const express = require('express');

const app = express();

app.use(express.json());

const inventoryRoutes = require('./routes/inventoryRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const shipmentRoutes = require('./routes/shipmentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

app.use('/', inventoryRoutes);
app.use('/', supplierRoutes);
app.use('/', shipmentRoutes);
app.use('/', analyticsRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'National Pharma Dashboard Backend API is running',
    version: '1.0.0',
    endpoints: [
      '/inventory',
      '/suppliers',
      '/shipments',
      '/analytics/dashboard'
    ]
  });
});

module.exports = app;