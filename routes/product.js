const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');

const router = express.Router();

// In-memory storage for demo when MongoDB is not available
let products = [];
let productIdCounter = 1;

// Middleware to check if user is authenticated and is a farmer
const isAuthenticated = async (req, res, next) => {
  const { userId } = req.body;
  
  if (!userId) {
    return res.status(403).json({ message: 'User ID is required' });
  }

  try {
    let user;
    
    if (mongoose.connection.readyState === 1) {
      // MongoDB is connected
      user = await User.findById(userId);
    } else {
      // Use in-memory storage
      const users = require('./auth').users || [];
      user = users.find(u => u.id == userId);
    }

    if (!user || user.role !== 'farmer') {
      return res.status(403).json({ message: 'Access denied. Only farmers can add products.' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /add-product
router.post('/add-product', isAuthenticated, async (req, res) => {
  const { name, price, imageURL, userId } = req.body;

  if (!name || !price || !imageURL) {
    return res.status(400).json({ message: 'Name, price, and image URL are required' });
  }

  try {
    if (mongoose.connection.readyState === 1) {
      // MongoDB is connected
      const product = new Product({
        name,
        price: parseFloat(price),
        imageURL,
        addedByUserId: userId
      });
      await product.save();
      
      res.status(201).json({ 
        message: 'Product added successfully',
        product: {
          id: product._id,
          name: product.name,
          price: product.price,
          imageURL: product.imageURL,
          addedByUserId: product.addedByUserId
        }
      });
    } else {
      // Use in-memory storage
      const product = {
        id: productIdCounter++,
        name,
        price: parseFloat(price),
        imageURL,
        addedByUserId: userId,
        createdAt: new Date()
      };
      products.push(product);
      
      res.status(201).json({ 
        message: 'Product added successfully',
        product
      });
    }
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /products
router.get('/products', async (req, res) => {
  try {
    let productList;
    
    if (mongoose.connection.readyState === 1) {
      // MongoDB is connected
      productList = await Product.find().populate('addedByUserId', 'name email');
    } else {
      // Use in-memory storage
      productList = products.map(product => ({
        ...product,
        _id: product.id
      }));
    }

    res.status(200).json(productList);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /products/:id
router.get('/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    let product;
    
    if (mongoose.connection.readyState === 1) {
      // MongoDB is connected
      product = await Product.findById(id).populate('addedByUserId', 'name email');
    } else {
      // Use in-memory storage
      product = products.find(p => p.id == id);
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;