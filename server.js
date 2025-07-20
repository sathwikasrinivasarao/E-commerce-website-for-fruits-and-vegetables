require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');

const app = express();
const PORT = process.env.PORT || 4003;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cors')());

// Serve static files from the template directory
app.use(express.static(path.join(__dirname, 'vegetable-website-template')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Sample route
app.get('/', (req, res) => {
  res.send('Welcome to the Fruits and Vegetable E-commerce Website!');
});

// Products route
app.get('/products', (req, res) => {
  res.json({ message: 'List of products' });
});

// Cart route
app.get('/cart', (req, res) => {
  res.json({ message: 'Your cart' });
});

// Checkout route
app.post('/checkout', (req, res) => {
  res.json({ message: 'Checkout process' });
});

// Routes
app.use('/api', authRoutes);
app.use('/api', productRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
