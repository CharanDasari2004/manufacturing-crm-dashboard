const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./models/User');
  const hash = await bcrypt.hash('admin123', 10);
  await User.create({
    name: 'Admin',
    email: 'admin@crm.com',
    password: hash,
    role: 'admin'
  });
  console.log('Admin created!');
  process.exit();
});