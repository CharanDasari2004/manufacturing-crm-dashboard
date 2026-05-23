const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const { auth } = require('../middleware/auth');

// Get all leads
router.get('/', auth, async (req, res) => {
  try {
    const leads = await Lead.find().populate('assignedTo', 'name email');
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add lead
router.post('/', auth, async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update lead
router.put('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete lead
router.delete('/:id', auth, async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add note to lead
router.post('/:id/notes', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    lead.notes.push({ text: req.body.text });
    await lead.save();
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;