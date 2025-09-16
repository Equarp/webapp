const express = require('express');
const { pool } = require('../database');
const router = express.Router();

// Создание транзакции
router.post('/', async (req, res) => {
  try {
    const { userId, type, currency, amount, status } = req.body;

    const transaction = await pool.query(
      `INSERT INTO transactions (user_id, type, currency, amount, status) 
       SELECT id, $2, $3, $4, $5 FROM users WHERE telegram_id = $1 
       RETURNING *`,
      [userId, type, currency, amount, status || 'pending']
    );

    res.json(transaction.rows[0]);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;