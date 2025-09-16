const express = require('express');
const { pool } = require('../database');
const router = express.Router();

// Получение баланса пользователя
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const balance = await pool.query(
      `SELECT b.ton_balance, b.stars_balance 
       FROM balances b 
       JOIN users u ON b.user_id = u.id 
       WHERE u.telegram_id = $1`,
      [userId]
    );

    if (balance.rows.length === 0) {
      return res.json({ ton: 0, stars: 0 });
    }

    res.json({
      ton: parseFloat(balance.rows[0].ton_balance),
      stars: balance.rows[0].stars_balance
    });
  } catch (error) {
    console.error('Error getting balance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обновление баланса
router.post('/', async (req, res) => {
  try {
    const { userId, currency, amount } = req.body;

    let updateField;
    if (currency === 'ton') {
      updateField = 'ton_balance = ton_balance + $1';
    } else if (currency === 'stars') {
      updateField = 'stars_balance = stars_balance + $1';
    } else {
      return res.status(400).json({ error: 'Invalid currency' });
    }

    await pool.query(
      `UPDATE balances 
       SET ${updateField}, updated_at = CURRENT_TIMESTAMP 
       FROM users 
       WHERE balances.user_id = users.id AND users.telegram_id = $2`,
      [amount, userId]
    );

    res.json({ success: true, message: 'Balance updated' });
  } catch (error) {
    console.error('Error updating balance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;