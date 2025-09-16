class Database {
    constructor() {
        this.baseUrl = window.location.origin;
    }

    async initUser(telegramUser) {
        try {
            const response = await fetch('/api/user', {
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
                    languageCode: telegramUser.language_code,
                    initData: Telegram.WebApp.initData
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.warn('Database initUser failed:', error);
            // Возвращаем данные из Telegram как fallback
            return {
                id: telegramUser.id,
                firstName: telegramUser.first_name,
                lastName: telegramUser.last_name,
                username: telegramUser.username,
                photoUrl: telegramUser.photo_url
            };
        }
    }

    async getUserBalance(userId) {
        try {
            const response = await fetch(`/api/balance/${userId}`);
            if (!response.ok) return { ton: 0, stars: 0 };
            return await response.json();
        } catch (error) {
            console.warn('getUserBalance failed:', error);
            return { ton: 0, stars: 0 };
        }
    }
}

window.db = new Database();
