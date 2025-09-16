const express = require('express');
const router = express.Router();

// Import routes
const userRoutes = require('./user');
const balanceRoutes = require('./balance');
const transactionRoutes = require('./transaction');
const giftRoutes = require('./gift');

// Use routes
router.use('/user', userRoutes);
router.use('/balance', balanceRoutes);
router.use('/transaction', transactionRoutes);
router.use('/gift', giftRoutes);

module.exports = router;