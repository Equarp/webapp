class GameWebApp {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    async init() {
        try {
            this.showLoadingScreen();
            
            // Инициализация Telegram
            Telegram.WebApp.ready();
            Telegram.WebApp.expand();
            
            // Ждем немного для стабилизации
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const telegramUser = Telegram.WebApp.initDataUnsafe.user;
            console.log('Telegram User:', telegramUser);
            
            if (!telegramUser || !telegramUser.id) {
                throw new Error('Данные пользователя не получены');
            }
            
            // Немедленно обновляем UI
            this.updateUserProfile(telegramUser);
            
            // Инициализируем навигацию
            this.initializeNavigation();
            
            // Настраиваем обработчики
            this.setupEventListeners();
            
            // Скрываем загрузку
            setTimeout(() => {
                this.hideLoadingScreen();
                console.log('App initialized successfully');
            }, 1500);
            
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError(error.message);
            this.hideLoadingScreen();
        }
    }

    updateUserProfile(telegramUser) {
        // Обновляем имя
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            const name = `${telegramUser.first_name || ''} ${telegramUser.last_name || ''}`.trim();
            userNameElement.textContent = name || 'Пользователь';
        }
        
        // Обновляем аватар
        const userAvatarElement = document.getElementById('user-avatar');
        if (userAvatarElement) {
            if (telegramUser.photo_url) {
                userAvatarElement.src = telegramUser.photo_url;
                userAvatarElement.onerror = () => {
                    this.setFallbackAvatar(telegramUser.first_name, telegramUser.last_name);
                };
            } else {
                this.setFallbackAvatar(telegramUser.first_name, telegramUser.last_name);
            }
        }
    }

    setFallbackAvatar(firstName, lastName) {
        const userAvatarElement = document.getElementById('user-avatar');
        if (userAvatarElement) {
            const first = firstName ? firstName[0] : '';
            const last = lastName ? lastName[0] : '';
            const initials = (first + last).toUpperCase() || 'U';
            
            const colors = ['#00f3ff', '#ff00ff', '#bd00ff'];
            const color = colors[initials.charCodeAt(0) % colors.length];
            
            userAvatarElement.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="${color}20" rx="40"/><text x="40" y="45" text-anchor="middle" fill="${color}" font-family="Arial" font-size="30" font-weight="bold">${initials}</text></svg>`;
        }
    }

    initializeNavigation() {
        console.log('Initializing navigation...');
        
        // Активируем главную страницу
        this.showPage('home');
        
        // Активируем кнопку главной страницы
        this.activateNavButton('home');
    }

    showPage(pageId) {
        console.log('Showing page:', pageId);
        
        // Скрываем все страницы
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Показываем выбранную страницу
        const pageElement = document.getElementById(`${pageId}-page`);
        if (pageElement) {
            pageElement.classList.add('active');
            this.currentPage = pageId;
        }
    }

    activateNavButton(pageId) {
        // Деактивируем все кнопки
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Активируем выбранную кнопку
        const activeButton = document.querySelector(`[data-page="${pageId}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Навигация
        document.querySelectorAll('.nav-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = e.currentTarget.getAttribute('data-page');
                console.log('Navigation to:', pageId);
                
                this.showPage(pageId);
                this.activateNavButton(pageId);
            });
        });
        
        // Обработчики кнопок
        this.setupButton('deposit-ton', 'Пополнение TON');
        this.setupButton('withdraw-ton', 'Вывод TON');
        this.setupButton('deposit-stars', 'Пополнение Stars');
        this.setupButton('withdraw-stars', 'Вывод Stars');
        this.setupButton('request-gift', 'Подарок');
    }

    setupButton(buttonId, title) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', () => {
                Telegram.WebApp.showPopup({
                    title: title,
                    message: 'Функция в разработке',
                    buttons: [{ type: 'ok' }]
                });
            });
        }
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        if (loadingScreen) loadingScreen.classList.remove('hidden');
        if (app) app.classList.add('hidden');
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        if (loadingScreen) loadingScreen.classList.add('hidden');
        if (app) app.classList.remove('hidden');
    }

    showError(message) {
        Telegram.WebApp.showPopup({
            title: 'Ошибка',
            message: message,
            buttons: [{ type: 'ok' }]
        });
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting app...');
    window.app = new GameWebApp();
});

class GameWebApp {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    async init() {
        try {
            // Блокировка масштабирования
            this.disableZoom();
            
            this.showLoadingScreen();
            
            Telegram.WebApp.ready();
            Telegram.WebApp.expand();
            
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const telegramUser = Telegram.WebApp.initDataUnsafe.user;
            console.log('Telegram User:', telegramUser);
            
            if (!telegramUser || !telegramUser.id) {
                throw new Error('Данные пользователя не получены');
            }
            
            this.updateUserProfile(telegramUser);
            this.initializeNavigation();
            this.setupEventListeners();
            
            setTimeout(() => {
                this.hideLoadingScreen();
                console.log('App initialized successfully');
            }, 1500);
            
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError(error.message);
            this.hideLoadingScreen();
        }
    }

    disableZoom() {
        // Блокировка жестов масштабирования
        document.addEventListener('touchstart', function(event) {
            if (event.touches.length > 1) {
                event.preventDefault();
            }
        }, { passive: false });

        document.addEventListener('gesturestart', function(event) {
            event.preventDefault();
        });

        document.addEventListener('gesturechange', function(event) {
            event.preventDefault();
        });

        document.addEventListener('gestureend', function(event) {
            event.preventDefault();
        });

        // Блокировка двойного тапа для масштабирования
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });

        // Блокировка скролла с двумя пальцами
        document.addEventListener('wheel', function(event) {
            if (event.ctrlKey) {
                event.preventDefault();
            }
        }, { passive: false });

        console.log('Zoom and scale disabled');
    }

    // остальные методы...
}
});
