const express = require('express');
const Application = require('../models/Application');

const router = express.Router();

// Submit application
router.post('/', async (req, res) => {
  try {
    const application = await Application.create(req.body);
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get applications for a student
router.get('/student/:studentId', async (req, res) => {
  try {
    const apps = await Application.find({ student: req.params.studentId })
      .populate('opening')
      .sort({ appliedAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all applications (admin)
router.get('/', async (req, res) => {
  try {
    const apps = await Application.find()
      .populate('student', 'name email')
      .populate('opening', 'title company')
      .sort({ appliedAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application status
router.patch('/:id', async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
