class Database {
    constructor() {
        this.baseUrl = window.location.origin;
    }

    async getUserBalance(userId) {
        try {
            const response = await fetch(`${this.baseUrl}/api/balance/${userId}`);
            if (!response.ok) return { ton: 0, stars: 0 };
            return await response.json();
        } catch (error) {
            console.warn('Ошибка получения баланса:', error);
            return { ton: 0, stars: 0 };
        }
    }

    async initUser(telegramUser) {
        try {
            const response = await fetch(`${this.baseUrl}/api/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    telegramId: telegramUser.id,
                    firstName: telegramUser.first_name,
                    lastName: telegramUser.last_name,
                    username: telegramUser.username,
                    photoUrl: telegramUser.photo_url,
                    initData: Telegram.WebApp.initData
                })
            });

            if (response.ok) {
                return await response.json();
            }
            return null;
        } catch (error) {
            console.warn('Ошибка инициализации пользователя:', error);
            return null;
        }
    }
}

window.db = new Database();
