# 🌿 Farm Marketplace - Complete E-Commerce Platform

A modern, fully responsive, and interactive Fruits & Vegetables E-Commerce Website connecting farmers directly with consumers.

## 🚀 Features

### Frontend Features
- ✅ Modern, responsive design (mobile, tablet, desktop)
- ✅ Interactive product browsing with search, filters, and sorting
- ✅ Product details page with ratings and reviews
- ✅ Shopping cart with localStorage persistence
- ✅ Secure checkout process with multiple payment options
- ✅ User authentication (register/login)
- ✅ User profile and order history
- ✅ Admin dashboard for farmers
- ✅ Toast notifications for user feedback
- ✅ Smooth animations and transitions
- ✅ Sticky navigation bar with cart badge

### Backend Features
- ✅ RESTful API with Express.js
- ✅ MongoDB database with Mongoose
- ✅ User authentication with bcrypt password hashing
- ✅ Product management (CRUD operations)
- ✅ Order processing and management
- ✅ Review and rating system
- ✅ Role-based access control (Farmer/Buyer)
- ✅ Stock management
- ✅ In-memory fallback when database unavailable

## 📁 Project Structure

```
farm-marketplace/
├── server.js                 # Express server & routes
├── package.json             # Dependencies
├── .env                     # Environment variables
├── models/                  # Database models
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   └── Review.js
├── routes/                  # API routes
│   ├── auth.js             # Authentication routes
│   ├── product.js          # Product routes
│   ├── order.js            # Order routes
│   └── review.js           # Review routes
├── frontend/               # Frontend pages
│   ├── shop.html           # Product browsing with filters
│   ├── product-details.html # Product details & reviews
│   ├── cart.html           # Shopping cart
│   ├── checkout.html       # Checkout process
│   ├── profile.html        # User profile & orders
│   ├── admin.html          # Admin dashboard
│   ├── about.html          # About page
│   ├── contact.html        # Contact page
│   ├── register.html       # User registration
│   ├── login.html          # User login
│   ├── add-product.html    # Product creation (farmers)
│   ├── utils.js            # Shared utilities
│   └── *.js               # Page-specific scripts
└── vegetable-website-template/ # Static assets & template

```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (optional, has in-memory fallback)

### Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file:
   ```
   MONGO_URI=mongodb://localhost:27017/farm-marketplace
   PORT=3000
   ```

3. **Start the Server**
   ```bash
   npm start
   ```

4. **Access the Application**
   Open your browser and navigate to:
   - Home: http://localhost:3000
   - Shop: http://localhost:3000/shop
   - Register: http://localhost:3000/register
   - Login: http://localhost:3000/login

## 📝 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/add-product` - Add product (farmers only)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/:userId` - Get user orders
- `GET /api/orders` - Get all orders (admin)
- `PATCH /api/orders/:id/status` - Update order status

### Reviews
- `POST /api/reviews` - Submit review
- `GET /api/reviews/:productId` - Get product reviews

## 👥 User Roles

### Buyer
- Browse and search products
- Add items to cart
- Place orders
- Write reviews
- View order history

### Farmer
- All buyer features
- Add new products
- Manage own products
- View all orders
- Update order status

## 🎨 Design Features

- **Color Theme**: Green (#81C408), Orange (#FFB524), White
- **Responsive Breakpoints**: Mobile (<768px), Tablet (768px-1024px), Desktop (>1024px)
- **Typography**: Open Sans & Raleway fonts
- **Icons**: Font Awesome 5
- **UI Components**: Bootstrap 5
- **Animations**: Smooth hover effects, transitions, and loading states

## 🔒 Security Features

- Password hashing with bcryptjs
- Role-based access control
- Input validation on both client and server
- Secure session management with localStorage
- Protected API endpoints

## 📦 Payment Methods

- Cash on Delivery (COD)
- UPI Payment
- Card Payment (Credit/Debit)

## 🚢 Deployment

The application is ready for deployment on:
- **Render**
- **Railway**
- **Vercel** (Frontend)
- **Heroku**
- **DigitalOcean**

### Build Command
```bash
npm run build
```

### Start Command
```bash
npm start
```

## 🌟 Key Features Implemented

✅ Complete user authentication system
✅ Product catalog with advanced filtering
✅ Shopping cart with quantity management
✅ Multi-step checkout process
✅ Order management system
✅ Review and rating system
✅ Admin dashboard for farmers
✅ Responsive design for all devices
✅ Real-time cart updates
✅ Toast notifications
✅ Loading states and error handling
✅ Sample product data seeding
✅ Clean, modular code structure

## 📱 Pages Overview

1. **Home** - Hero section, features, about
2. **Shop** - Product browsing with search/filters
3. **Product Details** - Full product info with reviews
4. **Cart** - Shopping cart management
5. **Checkout** - Order placement
6. **Profile** - User profile and order history
7. **Admin** - Dashboard for farmers
8. **About** - Company information
9. **Contact** - Contact form with map

## 🔧 Technologies Used

**Frontend:**
- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5
- Font Awesome
- jQuery

**Backend:**
- Node.js
- Express.js
- MongoDB & Mongoose
- bcryptjs
- CORS

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Author

Farm Marketplace Team

---

**Built with ❤️ for connecting farmers and consumers**
