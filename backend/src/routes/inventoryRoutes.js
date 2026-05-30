const express = require('express');
const router = express.Router();

router.get('/inventory', (req, res) => {
    res.json({ message: 'Get inventory' });
});

router.post('/inventory', (req, res) => {
    res.json({ message: 'Add medicine' });
});

router.put('/inventory/:id', (req, res) => {
    res.json({ message: `Update medicine ${req.params.id}` });
});

router.delete('/inventory/:id', (req, res) => {
    res.json({ message: `Delete medicine ${req.params.id}` });
});

module.exports = router;