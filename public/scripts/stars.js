class TelegramStars {
    constructor() {
        this.balance = 0;
    }

    async init(userId) {
        try {
            if (window.db) {
                const balances = await window.db.getUserBalance(userId);
                this.balance = balances.stars || 0;
                this.updateUI();
            }
        } catch (error) {
            console.warn('Ошибка загрузки Stars:', error);
            this.balance = 0;
            this.updateUI();
        }
    }

    updateUI() {
        const starsBalanceElement = document.getElementById('stars-balance');
        if (starsBalanceElement) {
            starsBalanceElement.textContent = `${this.balance} Stars`;
        }
    }
}

window.telegramStars = new TelegramStars();
