class UserProfile {
    constructor() {
        this.userData = null;
        this.tonBalance = 0;
    }

    async init(telegramUser) {
        try {
            console.log('🔄 Initializing profile with Telegram data:', telegramUser);
            
            if (!telegramUser || !telegramUser.id) {
                throw new Error('Invalid Telegram user data');
            }

            // Показываем данные сразу из Telegram НЕМЕДЛЕННО
            this.updateProfileUI(telegramUser);
            
            // Параллельно пытаемся сохранить/обновить в базе
            this.saveToDatabase(telegramUser);
            
            // Загружаем баланс
            await this.loadBalance(telegramUser.id);
            
        } catch (error) {
            console.error('❌ Profile init error:', error);
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
                console.log('✅ User saved to database:', result);
                this.userData = result;
            }
        } catch (error) {
            console.warn('⚠️ Failed to save user to database:', error);
        }
    }

    async loadBalance(userId) {
        try {
            const response = await fetch(`/api/balance/${userId}`);
            if (response.ok) {
                const balances = await response.json();
                this.tonBalance = balances.ton || 0;
                this.updateBalanceUI();
            }
        } catch (error) {
            console.warn('⚠️ Failed to load balance:', error);
        }
    }

    updateProfileUI(telegramUser = null) {
        const userNameElement = document.getElementById('user-name');
        const userAvatarElement = document.getElementById('user-avatar');
        
        if (!userNameElement || !userAvatarElement) {
            console.error('❌ Profile UI elements not found');
            return;
        }

        // Используем данные из Telegram (приоритет) или из базы
        const userData = telegramUser || this.userData;
        
        if (userData) {
            // Обновляем имя
            const firstName = userData.first_name || userData.firstName;
            const lastName = userData.last_name || userData.lastName;
            const name = `${firstName || ''} ${lastName || ''}`.trim();
            userNameElement.textContent = name || 'Пользователь';
            
            // Обновляем аватар
            const photoUrl = userData.photo_url || userData.photoUrl;
            if (photoUrl) {
                console.log('🖼️ Setting avatar URL:', photoUrl);
                userAvatarElement.src = photoUrl;
                
                // Обработка ошибки загрузки аватарки
                userAvatarElement.onerror = () => {
                    console.warn('❌ Avatar load failed, using fallback');
                    this.setFallbackAvatar(firstName, lastName);
                };
                
                userAvatarElement.onload = () => {
                    console.log('✅ Avatar loaded successfully');
                };
            } else {
                console.log('📸 No photo URL, using fallback avatar');
                this.setFallbackAvatar(firstName, lastName);
            }
        } else {
            console.log('👤 No user data, showing guest');
            this.showFallbackUI();
        }
    }

    setFallbackAvatar(firstName, lastName) {
        const userAvatarElement = document.getElementById('user-avatar');
        if (userAvatarElement) {
            const initials = this.getInitials(firstName, lastName);
            userAvatarElement.src = this.generateAvatar(initials);
            userAvatarElement.onerror = null; // Убираем обработчик ошибок
        }
    }

    getInitials(firstName, lastName) {
        const first = firstName ? firstName[0] : '';
        const last = lastName ? lastName[0] : '';
        return (first + last).toUpperCase() || 'U';
    }

    generateAvatar(initials) {
        const colors = ['#00f3ff', '#ff00ff', '#bd00ff', '#00ff87', '#ff9900'];
        const color = colors[initials.charCodeAt(0) % colors.length];
        
        return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
            <rect width="80" height="80" fill="${color}20" rx="40"/>
            <text x="40" y="45" text-anchor="middle" fill="${color}" font-family="Arial" font-size="30" font-weight="bold">${initials}</text>
        </svg>`;
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
        const starsBalanceElement = document.getElementById('stars-balance');
        
        if (tonBalanceElement) {
            tonBalanceElement.textContent = `${this.tonBalance} TON`;
        }
        if (starsBalanceElement) {
            starsBalanceElement.textContent = `${window.telegramStars?.balance || 0} Stars`;
        }
    }
}

window.userProfile = new UserProfile();
