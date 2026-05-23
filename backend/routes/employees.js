const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { auth, adminAuth } = require('../middleware/auth');

// Get all employees
router.get('/', auth, async (req, res) => {
  try {
    const employees = await Employee.find().populate('user', 'name email role');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add employee (admin only)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { name, email, password, phone, department, target } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'employee'
    });
    await user.save();

    const employee = new Employee({
      user: user._id,
      name,
      email,
      phone,
      department,
      target
    });
    await employee.save();

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete employee (admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;