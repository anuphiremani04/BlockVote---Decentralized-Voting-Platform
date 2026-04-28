const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/register (User only)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'User already exists.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user' // Public registration always forces 'user'
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hardcoded Admin Check as per requirements
    const adminEmail = process.env.ADMIN_EMAIL || 'anup04@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'anup@1234';

    if (email === adminEmail && password === adminPassword) {
      const token = jwt.sign(
        { _id: 'fixed_admin_id', role: 'admin', name: 'Admin' },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '8h' }
      );
      return res.json({ 
        token, 
        user: { _id: 'fixed_admin_id', name: 'Admin', email: adminEmail, role: 'admin' }
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password.' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid email or password.' });

    const token = jwt.sign(
      { _id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1h' }
    );

    res.json({ 
      token, 
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
