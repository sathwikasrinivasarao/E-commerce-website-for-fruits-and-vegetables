const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve static files from the vegetable-website-template directory
app.use(express.static(path.join(__dirname, 'vegetable-website-template/vegetable-website-template')));

// Serve frontend files
app.use('/frontend', express.static(path.join(__dirname, 'frontend')));

// MongoDB connection (using a local fallback for demo)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/farm-marketplace';

// Try to connect to MongoDB, but don't fail if it's not available
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 3000, // Timeout after 3 seconds instead of 30
  socketTimeoutMS: 3000,
})
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch(err => {
    console.log('⚠️  MongoDB connection failed, continuing without database');
    console.log('   To use database features, ensure MongoDB is running or set MONGO_URI in .env');
    console.log('   Error:', err.message);
  });

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', (err) => {
  console.log('MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'vegetable-website-template/vegetable-website-template/index.html'));
});

// API routes
app.use('/api', authRoutes);
app.use('/api', productRoutes);

// Serve frontend pages
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/login.html'));
});

app.get('/add-product', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/add-product.html'));
});

app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/products.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Farm Marketplace server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`👤 Register: http://localhost:${PORT}/register`);
  console.log(`🔐 Login: http://localhost:${PORT}/login`);
  console.log(`📦 Products: http://localhost:${PORT}/products`);
  console.log(`➕ Add Product: http://localhost:${PORT}/add-product`);
});