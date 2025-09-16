class UserProfile {
    constructor() {
        this.userData = null;
        this.tonBalance = 0;
    }

    async init(telegramUser) {
        try {
            console.log('Initializing profile with:', telegramUser);
            
            if (!telegramUser || !telegramUser.id) {
                throw new Error('Invalid Telegram user data');
            }

            // Используем данные напрямую из Telegram
            this.userData = {
                id: telegramUser.id,
                firstName: telegramUser.first_name,
                lastName: telegramUser.last_name,
                username: telegramUser.username,
                photoUrl: telegramUser.photo_url,
                languageCode: telegramUser.language_code
            };

            // Показываем данные сразу из Telegram
            this.updateProfileUI();
            
            // Пробуем сохранить в базу (но не блокируем интерфейс)
            this.saveToDatabase(telegramUser);
            
        } catch (error) {
            console.error('Profile init error:', error);
            this.showFallbackUI();
        }
    }

    async saveToDatabase(telegramUser) {
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

            if (response.ok) {
                const result = await response.json();
                console.log('User saved to database:', result);
            }
        } catch (error) {
            console.warn('Failed to save user to database:', error);
        }
    }

    updateProfileUI() {
        const userNameElement = document.getElementById('user-name');
        const userAvatarElement = document.getElementById('user-avatar');
        
        if (userNameElement) {
            if (this.userData) {
                const name = `${this.userData.firstName || ''} ${this.userData.lastName || ''}`.trim();
                userNameElement.textContent = name || 'Пользователь';
            } else {
                userNameElement.textContent = 'Гость';
            }
        }
        
        if (userAvatarElement) {
            if (this.userData && this.userData.photoUrl) {
                userAvatarElement.src = this.userData.photoUrl;
                userAvatarElement.onerror = () => this.setFallbackAvatar();
            } else {
                this.setFallbackAvatar();
            }
        }
    }

    setFallbackAvatar() {
        const userAvatarElement = document.getElementById('user-avatar');
        if (userAvatarElement) {
            // Создаем аватар с инициалами
            const name = `${this.userData?.firstName || ''} ${this.userData?.lastName || ''}`.trim();
            const initials = name ? name.split(' ').map(n => n[0]).join('') : 'U';
            userAvatarElement.src = this.generateAvatar(initials);
        }
    }

    generateAvatar(initials) {
        const colors = ['#00f3ff', '#ff00ff', '#bd00ff'];
        const color = colors[initials.charCodeAt(0) % colors.length];
        
        return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="${color}20" rx="40"/><text x="40" y="45" text-anchor="middle" fill="${color}" font-family="Arial" font-size="30" font-weight="bold">${initials}</text></svg>`;
    }

    showFallbackUI() {
        const userNameElement = document.getElementById('user-name');
        const userAvatarElement = document.getElementById('user-avatar');
        
        if (userNameElement) {
            userNameElement.textContent = 'Гость';
        }
        
        if (userAvatarElement) {
            userAvatarElement.src = this.generateAvatar('G');
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
