class UserProfile {
    constructor() {
        this.userData = null;
        this.tonBalance = 0;
    }

    async init() {
        try {
            const telegramUser = Telegram.WebApp.initDataUnsafe.user;
            
            if (!telegramUser) {
                throw new Error('Данные пользователя не получены');
            }
            
            this.userData = await db.initUser(telegramUser);
            const balances = await db.getUserBalance(telegramUser.id);
            this.tonBalance = balances.ton || 0;
            
            this.updateProfileUI();
            this.updateBalanceUI();
            
        } catch (error) {
            console.error('Ошибка инициализации профиля:', error);
        }
    }

    updateProfileUI() {
        const userNameElement = document.getElementById('user-name');
        const userAvatarElement = document.getElementById('user-avatar');
        
        if (userNameElement && this.userData) {
            userNameElement.textContent = `${this.userData.firstName} ${this.userData.lastName || ''}`.trim();
        }
        
        if (userAvatarElement && this.userData.photoUrl) {
            userAvatarElement.src = this.userData.photoUrl;
        } else if (userAvatarElement) {
            userAvatarElement.src = '/assets/images/default-avatar.png';
        }
    }

    updateBalanceUI() {
        const tonBalanceElement = document.getElementById('ton-balance');
        if (tonBalanceElement) {
            tonBalanceElement.textContent = `${this.tonBalance} TON`;
        }
    }

    async depositTON(amount) {
        try {
            const result = await tonWallet.depositToApp(amount);
            
            if (result.success) {
                this.tonBalance += amount;
                this.updateBalanceUI();
                
                const user = Telegram.WebApp.initDataUnsafe.user;
                await db.updateBalance(user.id, 'ton', amount);
                
                return { success: true, message: 'Баланс успешно пополнен' };
            }
        } catch (error) {
            console.error('Ошибка пополнения TON:', error);
            return { success: false, message: error.message };
        }
    }

    async withdrawTON(amount, address) {
        try {
            if (this.tonBalance < amount) {
                throw new Error('Недостаточно TON для вывода');
            }
            
            const result = await tonWallet.withdrawFromApp(amount, address);
            
            if (result.success) {
                this.tonBalance -= amount;
                this.updateBalanceUI();
                return result;
            }
        } catch (error) {
            console.error('Ошибка вывода TON:', error);
            return { success: false, message: error.message };
        }
    }

    async requestGift() {
        try {
            const giftCode = Math.random().toString(36).substring(2, 10).toUpperCase();
            
            Telegram.WebApp.showPopup({
                title: 'Запрос подарка',
                message: `Ваш код для подарка: ${giftCode}. Сообщите его администратору.`,
                buttons: [{ type: 'ok' }]
            });
            
            return { success: true, code: giftCode, message: 'Запрос подарка отправлен' };
        } catch (error) {
            console.error('Ошибка запроса подарка:', error);
            return { success: false, message: error.message };
        }
    }
}

const userProfile = new UserProfile();