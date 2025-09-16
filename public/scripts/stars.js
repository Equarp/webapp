class TelegramStars {
    constructor() {
        this.balance = 0;
    }

    async init() {
        try {
            const user = Telegram.WebApp.initDataUnsafe.user;
            const balances = await db.getUserBalance(user.id);
            this.balance = balances.stars || 0;
            this.updateUI();
        } catch (error) {
            console.error('Ошибка инициализации Stars:', error);
        }
    }

    updateUI() {
        const starsBalanceElement = document.getElementById('stars-balance');
        if (starsBalanceElement) {
            starsBalanceElement.textContent = `${this.balance} Stars`;
        }
    }

    async deposit(amount) {
        try {
            const user = Telegram.WebApp.initDataUnsafe.user;
            Telegram.WebApp.showPopup({
                title: 'Пополнение Stars',
                message: `Для пополнения на ${amount} Stars свяжитесь с администратором`,
                buttons: [{ type: 'ok' }]
            });
        } catch (error) {
            console.error('Ошибка пополнения Stars:', error);
            throw error;
        }
    }

    async withdraw(amount) {
        try {
            const user = Telegram.WebApp.initDataUnsafe.user;
            
            if (this.balance < amount) {
                throw new Error('Недостаточно Stars для вывода');
            }
            
            await db.createTransaction(user.id, 'withdraw', 'stars', amount, 'pending');
            this.balance -= amount;
            this.updateUI();
            
            return { success: true, message: 'Запрос на вывод отправлен' };
        } catch (error) {
            console.error('Ошибка вывода Stars:', error);
            throw error;
        }
    }

    async processGift(giftCode) {
        try {
            const user = Telegram.WebApp.initDataUnsafe.user;
            const result = await db.processGift(user.id, giftCode);
            
            if (result.success) {
                this.balance += result.amount;
                this.updateUI();
                return result;
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Ошибка обработки подарка:', error);
            throw error;
        }
    }
}

const telegramStars = new TelegramStars();