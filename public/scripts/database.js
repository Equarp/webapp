class Database {
    constructor() {
        this.baseUrl = CONFIG.API.BASE_URL;
    }

    async initUser(telegramData) {
        try {
            const response = await fetch(`${this.baseUrl}${CONFIG.API.ENDPOINTS.USER}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    telegramId: telegramData.id,
                    firstName: telegramData.first_name,
                    lastName: telegramData.last_name,
                    username: telegramData.username,
                    photoUrl: telegramData.photo_url,
                    initData: Telegram.WebApp.initData
                })
            });
            
            return await response.json();
        } catch (error) {
            console.error('Ошибка инициализации пользователя:', error);
            return null;
        }
    }

    async getUserData(userId) {
        try {
            const response = await fetch(`${this.baseUrl}${CONFIG.API.ENDPOINTS.USER}/${userId}`);
            return await response.json();
        } catch (error) {
            console.error('Ошибка получения данных пользователя:', error);
            return null;
        }
    }

    async getUserBalance(userId) {
        try {
            const response = await fetch(`${this.baseUrl}${CONFIG.API.ENDPOINTS.BALANCE}/${userId}`);
            return await response.json();
        } catch (error) {
            console.error('Ошибка получения баланса:', error);
            return { ton: 0, stars: 0 };
        }
    }

    async updateBalance(userId, currency, amount) {
        try {
            const response = await fetch(`${this.baseUrl}${CONFIG.API.ENDPOINTS.BALANCE}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId,
                    currency,
                    amount
                })
            });
            
            return await response.json();
        } catch (error) {
            console.error('Ошибка обновления баланса:', error);
            return false;
        }
    }

    async createTransaction(userId, type, currency, amount, status = 'pending') {
        try {
            const response = await fetch(`${this.baseUrl}${CONFIG.API.ENDPOINTS.TRANSACTION}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId,
                    type,
                    currency,
                    amount,
                    status
                })
            });
            
            return await response.json();
        } catch (error) {
            console.error('Ошибка создания транзакции:', error);
            return false;
        }
    }

    async processGift(userId, giftCode) {
        try {
            const response = await fetch(`${this.baseUrl}${CONFIG.API.ENDPOINTS.GIFT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId,
                    giftCode
                })
            });
            
            return await response.json();
        } catch (error) {
            console.error('Ошибка обработки подарка:', error);
            return { success: false, message: 'Ошибка обработки подарка' };
        }
    }
}

const db = new Database();