const express = require('express');
const { pool } = require('../database');
const router = express.Router();

// Обработка подарка
router.post('/', async (req, res) => {
  try {
    const { userId, giftCode } = req.body;

    // Проверяем валидность кода подарка
    const gift = await pool.query(
      'SELECT * FROM gifts WHERE code = $1 AND is_used = FALSE AND (expires_at IS NULL OR expires_at > NOW())',
      [giftCode]
    );

    if (gift.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or expired gift code' });
    }

    // Помечаем подарок как использованный
    await pool.query(
      'UPDATE gifts SET is_used = TRUE WHERE id = $1',
      [gift.rows[0].id]
    );

    // Зачисляем средства на баланс
    if (gift.rows[0].currency === 'ton') {
      await pool.query(
        `UPDATE balances 
         SET ton_balance = ton_balance + $1, updated_at = CURRENT_TIMESTAMP 
         FROM users 
         WHERE balances.user_id = users.id AND users.telegram_id = $2`,
        [gift.rows[0].amount, userId]
      );
    } else {
      await pool.query(
        `UPDATE balances 
         SET stars_balance = stars_balance + $1, updated_at = CURRENT_TIMESTAMP 
         FROM users 
         WHERE balances.user_id = users.id AND users.telegram_id = $2`,
        [gift.rows[0].amount, userId]
      );
    }

    // Создаем запись о транзакции
    await pool.query(
      `INSERT INTO transactions (user_id, type, currency, amount, status) 
       SELECT id, 'gift', $2, $3, 'completed' FROM users WHERE telegram_id = $1`,
      [userId, gift.rows[0].currency, gift.rows[0].amount]
    );

    res.json({ 
      success: true, 
      message: 'Gift processed successfully',
      amount: gift.rows[0].amount,
      currency: gift.rows[0].currency
    });
  } catch (error) {
    console.error('Error processing gift:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;