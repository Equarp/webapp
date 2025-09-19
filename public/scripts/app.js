class GameWebApp {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Starting app initialization...');
            
            // Показываем экран загрузки
            this.showLoadingScreen();
            
            // Даем время на отрисовку загрузки
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Инициализируем Telegram
            await this.initTelegram();
            
            // Получаем данные пользователя
            const userData = await this.getUserData();
            
            // Обновляем интерфейс
            this.updateUI(userData);
            
            // Настраиваем навигацию
            this.setupNavigation();
            
            // Скрываем загрузку
            setTimeout(() => {
                this.hideLoadingScreen();
                console.log('✅ App initialized successfully');
            }, 2000);
            
        } catch (error) {
            console.error('❌ App initialization failed:', error);
            this.showError(error.message);
            this.hideLoadingScreen();
        }
    }

    async initTelegram() {
        return new Promise((resolve) => {
            console.log('Initializing Telegram WebApp...');
            
            // Проверяем, доступен ли Telegram WebApp
            if (typeof Telegram === 'undefined' || !Telegram.WebApp) {
                throw new Error('Telegram WebApp not available');
            }
            
            Telegram.WebApp.ready();
            Telegram.WebApp.expand();
            
            // Даем время на инициализацию Telegram
            setTimeout(() => {
                console.log('Telegram WebApp ready');
                resolve();
            }, 300);
        });
    }

    async getUserData() {
        console.log('Getting user data...');
        
        // Проверяем данные Telegram
        if (!Telegram.WebApp.initDataUnsafe || !Telegram.WebApp.initDataUnsafe.user) {
            console.warn('No Telegram user data, using fallback');
            return this.getFallbackUserData();
        }
        
        const tgUser = Telegram.WebApp.initDataUnsafe.user;
        console.log('Telegram user:', tgUser);
        
        return {
            id: tgUser.id,
            firstName: tgUser.first_name,
            lastName: tgUser.last_name,
            username: tgUser.username,
            photoUrl: tgUser.photo_url,
            languageCode: tgUser.language_code
        };
    }

    getFallbackUserData() {
        // Заглушка если данные Telegram не доступны
        return {
            id: Math.random().toString(36).substr(2, 9),
            firstName: 'Гость',
            lastName: '',
            username: 'guest',
            photoUrl: null
        };
    }

    updateUI(userData) {
        console.log('Updating UI with user data:', userData);
        
        // Обновляем профиль
        this.updateProfile(userData);
        
        // Обновляем балансы
        this.updateBalances();
        
        // Активируем главную страницу
        this.showPage('home');
    }

    updateProfile(userData) {
        const userNameElement = document.getElementById('user-name');
        const userAvatarElement = document.getElementById('user-avatar');
        
        if (userNameElement) {
            const name = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
            userNameElement.textContent = name || 'Пользователь';
        }
        
        if (userAvatarElement) {
            if (userData.photoUrl) {
                userAvatarElement.src = userData.photoUrl;
                userAvatarElement.onerror = () => this.setFallbackAvatar(userData);
            } else {
                this.setFallbackAvatar(userData);
            }
        }
    }

    setFallbackAvatar(userData) {
        const userAvatarElement = document.getElementById('user-avatar');
        if (!userAvatarElement) return;
        
        const first = userData.firstName ? userData.firstName[0] : '';
        const last = userData.lastName ? userData.lastName[0] : '';
        const initials = (first + last).toUpperCase() || 'U';
        
        const colors = ['#00f3ff', '#ff00ff', '#bd00ff'];
        const color = colors[initials.charCodeAt(0) % colors.length];
        
        userAvatarElement.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="${color}20" rx="40"/><text x="40" y="45" text-anchor="middle" fill="${color}" font-family="Arial" font-size="30" font-weight="bold">${initials}</text></svg>`;
    }

    updateBalances() {
        // Заглушки для балансов
        const tonBalanceElement = document.getElementById('ton-balance');
        const starsBalanceElement = document.getElementById('stars-balance');
        
        if (tonBalanceElement) {
            tonBalanceElement.textContent = '0 TON';
        }
        if (starsBalanceElement) {
            starsBalanceElement.textContent = '0 Stars';
        }
    }

    setupNavigation() {
        console.log('Setting up navigation...');
        
        const navButtons = document.querySelectorAll('.nav-btn');
        if (!navButtons.length) {
            console.warn('No navigation buttons found');
            return;
        }
        
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.getAttribute('data-page');
                console.log('Navigating to:', page);
                this.showPage(page);
            });
        });
        
        // Простые обработчики для кнопок
        this.setupBasicButton('deposit-ton', 'Пополнение TON');
        this.setupBasicButton('withdraw-ton', 'Вывод TON');
        this.setupBasicButton('deposit-stars', 'Пополнение Stars');
        this.setupBasicButton('withdraw-stars', 'Вывод Stars');
        this.setupBasicButton('request-gift', 'Подарок');
        this.setupBasicButton('place-bet', 'Ставка');
        this.setupBasicButton('add-bet', 'Добавить ставку');
    }

    setupBasicButton(buttonId, message) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', () => {
                Telegram.WebApp.showPopup({
                    title: message,
                    message: 'Функция в разработке',
                    buttons: [{ type: 'ok' }]
                });
            });
        }
    }

    showPage(pageId) {
        console.log('Showing page:', pageId);
        
        // Скрываем все страницы
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Показываем выбранную страницу
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
        }
        
        // Обновляем активную кнопку навигации
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-page="${pageId}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    showLoadingScreen() {
        console.log('Showing loading screen...');
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
            loadingScreen.classList.remove('hidden');
        }
        if (app) {
            app.style.display = 'none';
            app.classList.add('hidden');
        }
    }

    hideLoadingScreen() {
        console.log('Hiding loading screen...');
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
            loadingScreen.classList.add('hidden');
        }
        if (app) {
            app.style.display = 'block';
            app.classList.remove('hidden');
        }
    }

    showError(message) {
        console.error('Showing error:', message);
        
        // Простой alert вместо сложных popup
        alert(`Ошибка: ${message}\n\nПриложение будет работать в ограниченном режиме.`);
    }
}

// Аварийный обработчик ошибок
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    
    // Пытаемся скрыть экран загрузки при любой ошибке
    const loadingScreen = document.getElementById('loading-screen');
    const app = document.getElementById('app');
    
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
    if (app) {
        app.style.display = 'block';
    }
});

// Запуск приложения когда DOM готов
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    
    // Даем дополнительное время для полной загрузки
    setTimeout(() => {
        window.app = new GameWebApp();
    }, 100);
});

// Резервный запуск если DOM уже загружен
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        window.app = new GameWebApp();
    }, 100);
}
