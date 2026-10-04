const express = require('express');
const Opening = require('../models/Opening');

const router = express.Router();

// Get all openings
router.get('/', async (req, res) => {
  try {
    const { state, field, duration } = req.query;
    let filter = { status: 'open' };

    if (state) filter.location = state;
    if (field) filter.field = field;
    if (duration) filter.duration = duration;

    const openings = await Opening.find(filter).sort({ createdAt: -1 });
    res.json(openings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single opening
router.get('/:id', async (req, res) => {
  try {
    const opening = await Opening.findById(req.params.id);
    if (!opening) return res.status(404).json({ message: 'Opening not found' });
    res.json(opening);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create opening (admin)
router.post('/', async (req, res) => {
  try {
    const opening = await Opening.create(req.body);
    res.status(201).json(opening);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
