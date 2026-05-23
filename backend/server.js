const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const leadRoutes = require('./routes/leads');
const employeeRoutes = require('./routes/employees');

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/employees', employeeRoutes);

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log('Server running on port 5000');
    });
  })
  .catch((err) => console.log(err));