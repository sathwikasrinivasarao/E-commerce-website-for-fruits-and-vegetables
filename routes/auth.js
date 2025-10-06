const express = require('express');
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');

const router = express.Router();

// In-memory storage for demo when MongoDB is not available
let users = [];
let userIdCounter = 1;

// POST /register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      // MongoDB is connected
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcryptjs.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword, role });
      await user.save();
      
      res.status(201).json({ 
        message: 'User registered successfully',
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    } else {
      // Use in-memory storage
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcryptjs.hash(password, 10);
      const user = {
        id: userIdCounter++,
        name,
        email,
        password: hashedPassword,
        role
      };
      users.push(user);
      
      res.status(201).json({ 
        message: 'User registered successfully',
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user;
    
    if (mongoose.connection.readyState === 1) {
      // MongoDB is connected
      user = await User.findOne({ email });
    } else {
      // Use in-memory storage
      user = users.find(u => u.email === email);
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
module.exports.users = users;