const express = require('express');
const mongoose = require('mongoose');
const Review = require('../models/Review');
const Product = require('../models/Product');

const router = express.Router();

let reviews = [];
let reviewIdCounter = 1;

router.post('/reviews', async (req, res) => {
  const { productId, userId, rating, comment } = req.body;

  if (!productId || !userId || !rating) {
    return res.status(400).json({ message: 'Product ID, User ID, and rating are required' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const existingReview = await Review.findOne({ productId, userId });
      if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this product' });
      }

      const review = new Review({
        productId,
        userId,
        rating,
        comment: comment || ''
      });

      await review.save();

      const productReviews = await Review.find({ productId });
      const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
      await Product.findByIdAndUpdate(productId, { rating: avgRating.toFixed(1) });

      res.status(201).json({
        message: 'Review submitted successfully',
        review
      });
    } else {
      const existingReview = reviews.find(r => r.productId == productId && r.userId == userId);
      if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this product' });
      }

      const review = {
        id: reviewIdCounter++,
        productId,
        userId,
        rating,
        comment: comment || '',
        createdAt: new Date()
      };
      reviews.push(review);

      res.status(201).json({
        message: 'Review submitted successfully',
        review
      });
    }
  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/reviews/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    if (mongoose.connection.readyState === 1) {
      const productReviews = await Review.find({ productId })
        .populate('userId', 'name')
        .sort({ createdAt: -1 });
      res.status(200).json(productReviews);
    } else {
      const productReviews = reviews.filter(r => r.productId == productId);
      res.status(200).json(productReviews);
    }
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
