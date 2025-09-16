class TelegramStars {
    constructor() {
        this.balance = 0;
    }

    async init(userId) {
        try {
            const balances = await db.getUserBalance(userId);
            this.balance = balances.stars || 0;
            this.updateUI();
        } catch (error) {
            console.warn('Stars init failed:', error);
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
