class UserProfile {
    constructor() {
        this.userData = null;
        this.tonBalance = 0;
    }

    async init() {
        try {
            const telegramUser = Telegram.WebApp.initDataUnsafe.user;
            
            if (!telegramUser) {
                console.error('No Telegram user data available');
                // Покажем заглушку
                this.showFallbackUI();
                return;
            }
            
            console.log('Initializing profile with Telegram data:', telegramUser);
            
            this.userData = await db.initUser(telegramUser);
            
            if (!this.userData) {
                throw new Error('Failed to initialize user data');
            }
            
            const balances = await db.getUserBalance(telegramUser.id);
            this.tonBalance = balances.ton || 0;
            
            this.updateProfileUI();
            this.updateBalanceUI();
            
        } catch (error) {
            console.error('Ошибка инициализации профиля:', error);
            this.showFallbackUI();
        }
    }

    updateProfileUI() {
        const userNameElement = document.getElementById('user-name');
        const userAvatarElement = document.getElementById('user-avatar');
        
        // Используем данные напрямую из Telegram, если есть
        const telegramUser = Telegram.WebApp.initDataUnsafe.user;
        
        if (userNameElement) {
            if (this.userData) {
                userNameElement.textContent = `${this.userData.firstName} ${this.userData.lastName || ''}`.trim();
            } else if (telegramUser) {
                userNameElement.textContent = `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim();
            } else {
                userNameElement.textContent = 'Гость';
            }
        }
        
        if (userAvatarElement) {
            if (this.userData && this.userData.photoUrl) {
                userAvatarElement.src = this.userData.photoUrl;
                userAvatarElement.onerror = () => {
                    this.setFallbackAvatar();
                };
            } else if (telegramUser && telegramUser.photo_url) {
                userAvatarElement.src = telegramUser.photo_url;
                userAvatarElement.onerror = () => {
                    this.setFallbackAvatar();
                };
            } else {
                this.setFallbackAvatar();
            }
        }
    }

    setFallbackAvatar() {
        const userAvatarElement = document.getElementById('user-avatar');
        if (userAvatarElement) {
            // Используем инициалы или дефолтную картинку
            const telegramUser = Telegram.WebApp.initDataUnsafe.user;
            if (telegramUser && telegramUser.first_name) {
                // Создаем аватар с инициалами
                userAvatarElement.src = this.generateAvatarFromName(telegramUser.first_name, telegramUser.last_name);
            } else {
                userAvatarElement.src = '/assets/images/default-avatar.png';
            }
        }
    }

    generateAvatarFromName(firstName, lastName) {
        // Создаем SVG аватар с инициалами
        const initials = `${firstName ? firstName[0] : ''}${lastName ? lastName[0] : ''}` || 'U';
        const colors = ['#00f3ff', '#ff00ff', '#bd00ff'];
        const color = colors[initials.charCodeAt(0) % colors.length];
        
        return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="${color}" opacity="0.2"/><text x="40" y="45" text-anchor="middle" fill="${color}" font-size="30" font-weight="bold">${initials}</text></svg>`;
    }

    showFallbackUI() {
        this.updateProfileUI();
        this.updateBalanceUI();
        
        // Покажем предупреждение
        console.warn('Using fallback UI mode');
    }

    updateBalanceUI() {
        const tonBalanceElement = document.getElementById('ton-balance');
        if (tonBalanceElement) {
            tonBalanceElement.textContent = `${this.tonBalance} TON`;
        }
        
        const starsBalanceElement = document.getElementById('stars-balance');
        if (starsBalanceElement) {
            starsBalanceElement.textContent = `${telegramStars.balance} Stars`;
        }
    }

    // ... остальные методы без изменений
}
