class Database {
    constructor() {
        this.baseUrl = CONFIG.API.BASE_URL;
        console.log('Database base URL:', this.baseUrl);
    }

    async initUser(telegramData) {
        try {
            console.log('Initializing user with data:', {
                id: telegramData.id,
                name: `${telegramData.first_name} ${telegramData.last_name}`
            });

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
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('User initialization result:', result);
            return result;
            
        } catch (error) {
            console.error('Ошибка инициализации пользователя:', error);
            // Возвращаем заглушку вместо null
            return {
                id: telegramData.id,
                firstName: telegramData.first_name,
                lastName: telegramData.last_name,
                username: telegramData.username,
                photoUrl: telegramData.photo_url
            };
        }
    }
    // ... остальные методы
}
