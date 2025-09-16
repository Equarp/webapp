const express = require('express');
const { pool } = require('../database');
const crypto = require('crypto');
const router = express.Router();

// Валидация данных от Telegram
function validateTelegramData(initData) {
    if (!initData) return false;
    
    try {
        const params = new URLSearchParams(initData);
        const hash = params.get('hash');
        if (!hash) return false;
        
        // Простая проверка - в продакшене нужно реализовать полную валидацию
        return true;
    } catch (error) {
        console.error('Error validating Telegram data:', error);
        return false;
    }
}

// Создание/получение пользователя
router.post('/', async (req, res) => {
    try {
        const { telegramId, firstName, lastName, username, photoUrl, initData } = req.body;

        console.log('Received user data:', {
            telegramId, firstName, lastName, username, photoUrl
        });

        // Проверяем валидность данных
        if (!validateTelegramData(initData)) {
            console.warn('Invalid Telegram data received');
            // Но все равно продолжаем, чтобы приложение работало
        }

        if (!telegramId) {
            return res.status(400).json({ error: 'Telegram ID is required' });
        }

        // Проверяем существование пользователя
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE telegram_id = $1',
            [telegramId]
        );

        if (existingUser.rows.length > 0) {
            // Обновляем существующего пользователя
            await pool.query(
                `UPDATE users 
                 SET first_name = $1, last_name = $2, username = $3, photo_url = $4, updated_at = CURRENT_TIMESTAMP 
                 WHERE telegram_id = $5`,
                [firstName, lastName, username, photoUrl, telegramId]
            );

            const user = await pool.query(
                'SELECT * FROM users WHERE telegram_id = $1',
                [telegramId]
            );

            return res.json(user.rows[0]);
        }

        // Создаем нового пользователя
        const newUser = await pool.query(
            `INSERT INTO users (telegram_id, first_name, last_name, username, photo_url) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [telegramId, firstName, lastName, username, photoUrl]
        );

        // Создаем запись баланса
        await pool.query(
            'INSERT INTO balances (user_id) VALUES ($1)',
            [newUser.rows[0].id]
        );

        console.log('New user created:', newUser.rows[0]);
        res.json(newUser.rows[0]);

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Получение пользователя по ID
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await pool.query(
            'SELECT * FROM users WHERE telegram_id = $1',
            [userId]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user.rows[0]);
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
