# Farm Marketplace Application

## Overview
This project is a web application for a farm marketplace, allowing farmers to register, add products, and buyers to view and purchase products.

## Features
- User Registration and Login
- Product Addition by Farmers
- Product Listing for Buyers
- Google Maps Integration for Farm Locations

## Setup Instructions
1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the Project Directory**
   ```bash
   cd sample-project
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Environment Variables**
   - Copy the `.env` file and configure your MongoDB connection:
     - For local MongoDB: Uncomment the local MongoDB URI line
     - For MongoDB Atlas: Uncomment and fill in your Atlas connection string
     - For other MongoDB servers: Uncomment and modify the custom URI line
   - **Note**: The application will run without a database connection, but database features will be limited.

5. **Run the Application**
   ```bash
   node backend/server.js
   ```

## Usage
- Access the application at `http://localhost:4002`.
- Use the registration and login forms to create and access accounts.
- Farmers can add products, and buyers can view products on the listing page.

## Future Enhancements
- Payment Integration
- Additional Features and Improvements

## License
This project is licensed under the MIT License.
