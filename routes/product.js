const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');

const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = async (req, res, next) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user || user.role !== 'farmer') {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// POST /add-product
router.post('/add-product', isAuthenticated, async (req, res) => {
  const { name, price, imageURL, userId } = req.body;

  try {
    const product = new Product({
      name,
      price,
      imageURL,
      addedByUserId: userId
    });

    await product.save();
    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// GET /products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
