class UserProfile {
    constructor() {
        this.tonBalance = 0;
    }

    async init(telegramUser) {
        try {
            // Пытаемся загрузить баланс из базы
            await this.loadBalance(telegramUser.id);
        } catch (error) {
            console.warn('Ошибка загрузки баланса:', error);
            this.tonBalance = 0;
            this.updateBalanceUI();
        }
    }

    async loadBalance(userId) {
        try {
            if (window.db) {
                const balances = await window.db.getUserBalance(userId);
                this.tonBalance = balances.ton || 0;
                this.updateBalanceUI();
            }
        } catch (error) {
            throw error;
        }
    }

    updateBalanceUI() {
        const tonBalanceElement = document.getElementById('ton-balance');
        if (tonBalanceElement) {
            tonBalanceElement.textContent = `${this.tonBalance} TON`;
        }
    }
}

window.userProfile = new UserProfile();
