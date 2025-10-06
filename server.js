require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const reviewRoutes = require('./routes/review');

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
app.use('/api', orderRoutes);
app.use('/api', reviewRoutes);

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

app.get('/shop', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/shop.html'));
});

app.get('/product-details/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/product-details.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/cart.html'));
});

app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/checkout.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/profile.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/admin.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/about.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/contact.html'));
});

// Seed initial products if database is empty
const seedProducts = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      const Product = require('./models/Product');
      const count = await Product.countDocuments();

      if (count === 0) {
        const products = [
          {
            name: 'Fresh Apples',
            description: 'Crisp and juicy red apples, freshly picked from local orchards',
            price: 4.99,
            category: 'fruits',
            imageURL: '/img/fruite-item-1.jpg',
            stock: 100,
            rating: 4.5
          },
          {
            name: 'Organic Bananas',
            description: 'Sweet organic bananas, rich in potassium and nutrients',
            price: 3.49,
            category: 'fruits',
            imageURL: '/img/fruite-item-2.jpg',
            stock: 150,
            rating: 4.8
          },
          {
            name: 'Ripe Oranges',
            description: 'Fresh Valencia oranges, perfect for juice or snacking',
            price: 5.99,
            category: 'fruits',
            imageURL: '/img/fruite-item-3.jpg',
            stock: 80,
            rating: 4.3
          },
          {
            name: 'Sweet Grapes',
            description: 'Seedless green grapes, sweet and refreshing',
            price: 6.99,
            category: 'fruits',
            imageURL: '/img/fruite-item-4.jpg',
            stock: 60,
            rating: 4.6
          },
          {
            name: 'Fresh Strawberries',
            description: 'Premium strawberries, sweet and aromatic',
            price: 8.99,
            category: 'fruits',
            imageURL: '/img/fruite-item-5.jpg',
            stock: 40,
            rating: 4.9
          },
          {
            name: 'Organic Tomatoes',
            description: 'Vine-ripened organic tomatoes, perfect for salads',
            price: 4.49,
            category: 'vegetables',
            imageURL: '/img/vegetable-item-1.jpg',
            stock: 120,
            rating: 4.4
          },
          {
            name: 'Fresh Broccoli',
            description: 'Green broccoli crowns, packed with vitamins',
            price: 3.99,
            category: 'vegetables',
            imageURL: '/img/vegetable-item-2.jpg',
            stock: 90,
            rating: 4.2
          },
          {
            name: 'Crispy Lettuce',
            description: 'Fresh iceberg lettuce, crisp and refreshing',
            price: 2.99,
            category: 'vegetables',
            imageURL: '/img/vegetable-item-3.png',
            stock: 110,
            rating: 4.1
          },
          {
            name: 'Bell Peppers',
            description: 'Colorful bell peppers, sweet and crunchy',
            price: 5.49,
            category: 'vegetables',
            imageURL: '/img/vegetable-item-4.jpg',
            stock: 85,
            rating: 4.5
          },
          {
            name: 'Fresh Carrots',
            description: 'Organic carrots, sweet and nutritious',
            price: 3.29,
            category: 'vegetables',
            imageURL: '/img/vegetable-item-5.jpg',
            stock: 130,
            rating: 4.7
          },
          {
            name: 'Organic Spinach',
            description: 'Fresh spinach leaves, iron-rich and healthy',
            price: 4.99,
            category: 'organic',
            imageURL: '/img/vegetable-item-6.jpg',
            stock: 70,
            rating: 4.8
          },
          {
            name: 'Best Quality Fruits',
            description: 'Mixed seasonal fruits basket',
            price: 12.99,
            category: 'seasonal',
            imageURL: '/img/best-product-1.jpg',
            stock: 50,
            rating: 4.6
          }
        ];

        await Product.insertMany(products);
        console.log('✅ Sample products added to database');
      }
    }
  } catch (error) {
    console.log('⚠️  Could not seed products:', error.message);
  }
};

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Farm Marketplace server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`👤 Register: http://localhost:${PORT}/register`);
  console.log(`🔐 Login: http://localhost:${PORT}/login`);
  console.log(`🛒 Shop: http://localhost:${PORT}/shop`);
  console.log(`📦 Products: http://localhost:${PORT}/products`);
  console.log(`➕ Add Product: http://localhost:${PORT}/add-product`);
  console.log(`🛍️  Cart: http://localhost:${PORT}/cart`);
  console.log(`💳 Checkout: http://localhost:${PORT}/checkout`);
  console.log(`👤 Profile: http://localhost:${PORT}/profile`);
  console.log(`⚙️  Admin: http://localhost:${PORT}/admin`);

  await seedProducts();
});