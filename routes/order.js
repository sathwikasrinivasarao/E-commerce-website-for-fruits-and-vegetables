const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');

const router = express.Router();

let orders = [];
let orderIdCounter = 1;

router.post('/orders', async (req, res) => {
  const { userId, items, totalAmount, paymentMethod, shippingAddress } = req.body;

  if (!userId || !items || !totalAmount || !paymentMethod || !shippingAddress) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    if (mongoose.connection.readyState === 1) {
      for (let item of items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({ message: `Product ${item.productId} not found` });
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
        }
      }

      const orderItems = items.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price
      }));

      const order = new Order({
        userId,
        items: orderItems,
        totalAmount,
        paymentMethod,
        shippingAddress,
        status: 'pending'
      });

      await order.save();

      for (let item of items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } }
        );
      }

      res.status(201).json({
        message: 'Order placed successfully',
        order: {
          id: order._id,
          ...order.toObject()
        }
      });
    } else {
      const order = {
        id: orderIdCounter++,
        userId,
        items,
        totalAmount,
        paymentMethod,
        shippingAddress,
        status: 'pending',
        createdAt: new Date()
      };
      orders.push(order);

      res.status(201).json({
        message: 'Order placed successfully',
        order
      });
    }
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/orders/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    if (mongoose.connection.readyState === 1) {
      const userOrders = await Order.find({ userId })
        .populate('items.product')
        .sort({ createdAt: -1 });
      res.status(200).json(userOrders);
    } else {
      const userOrders = orders.filter(order => order.userId == userId);
      res.status(200).json(userOrders);
    }
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/orders', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const allOrders = await Order.find()
        .populate('userId', 'name email')
        .populate('items.product')
        .sort({ createdAt: -1 });
      res.status(200).json(allOrders);
    } else {
      res.status(200).json(orders);
    }
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.patch('/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'processing', 'delivered', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const order = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.status(200).json({
        message: 'Order status updated',
        order
      });
    } else {
      const order = orders.find(o => o.id == id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      order.status = status;
      res.status(200).json({
        message: 'Order status updated',
        order
      });
    }
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
