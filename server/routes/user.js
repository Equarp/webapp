const express = require('express');
const { pool } = require('../database');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { telegramId, firstName, lastName, username, photoUrl } = req.body;

        if (!telegramId) {
            return res.status(400).json({ error: 'Telegram ID is required' });
        }

        // Проверяем существование пользователя
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE telegram_id = $1',
            [telegramId]
        );

        if (existingUser.rows.length > 0) {
            // Обновляем пользователя
            await pool.query(
                `UPDATE users SET first_name = $1, last_name = $2, username = $3, photo_url = $4 WHERE telegram_id = $5`,
                [firstName, lastName, username, photoUrl, telegramId]
            );
            const user = await pool.query('SELECT * FROM users WHERE telegram_id = $1', [telegramId]);
            return res.json(user.rows[0]);
        }

        // Создаем нового пользователя
        const newUser = await pool.query(
            `INSERT INTO users (telegram_id, first_name, last_name, username, photo_url) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [telegramId, firstName, lastName, username, photoUrl]
        );

        // Создаем запись баланса
        await pool.query('INSERT INTO balances (user_id) VALUES ($1)', [newUser.rows[0].id]);

        res.json(newUser.rows[0]);

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
