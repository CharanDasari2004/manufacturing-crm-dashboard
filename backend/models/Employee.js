const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  department: {
    type: String
  },
  target: {
    type: Number,
    default: 10
  },
  leadsAssigned: {
    type: Number,
    default: 0
  },
  leadsConverted: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);