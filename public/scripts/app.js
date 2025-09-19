class GameWebApp {
    constructor() {
        this.currentPage = 'home';
        this.isLoading = true;
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Starting application...');
            this.showLoadingScreen();
            
            // Инициализация Telegram WebApp на полный экран
            Telegram.WebApp.ready();
            Telegram.WebApp.expand(); // Важно: разворачиваем на весь экран
            
            // Блокировка масштабирования
            this.disableZoom();
            
            // Ждем инициализации Telegram
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const telegramUser = Telegram.WebApp.initDataUnsafe.user;
            console.log('Telegram user data:', telegramUser);
            
            if (!telegramUser || !telegramUser.id) {
                throw new Error('Данные пользователя Telegram не получены');
            }
            
            // Немедленно обновляем UI с данными пользователя
            this.updateUserProfile(telegramUser);
            
            // Инициализируем навигацию
            this.initializeNavigation();
            
            // Настраиваем обработчики событий
            this.setupEventListeners();
            
            // Скрываем загрузку через 2 секунды
            setTimeout(() => {
                this.hideLoadingScreen();
                this.isLoading = false;
                console.log('✅ Application initialized successfully');
            }, 2000);
            
        } catch (error) {
            console.error('❌ Application initialization error:', error);
            this.hideLoadingScreen();
            this.showError(error.message);
        }
    }

    disableZoom() {
        // Блокировка жестов масштабирования
        document.addEventListener('touchstart', function(event) {
            if (event.touches.length > 1) {
                event.preventDefault();
            }
        }, { passive: false });

        // Блокировка двойного тапа
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });

        console.log('🔒 Zoom and scale disabled');
    }

    updateUserProfile(telegramUser) {
        const userNameElement = document.getElementById('user-name');
        const userAvatarElement = document.getElementById('user-avatar');
        
        if (userNameElement) {
            const name = `${telegramUser.first_name || ''} ${telegramUser.last_name || ''}`.trim();
            userNameElement.textContent = name || 'Пользователь';
        }
        
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
        // Активируем главную страницу
        this.showPage('home');
        this.activateNavButton('home');
    }

    showPage(pageId) {
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
                console.log('Navigating to:', pageId);
                
                this.showPage(pageId);
                this.activateNavButton(pageId);
            });
        });

        // Обработчики кнопок
        this.setupButtonHandler('deposit-ton', 'Пополнение TON');
        this.setupButtonHandler('withdraw-ton', 'Вывод TON');
        this.setupButtonHandler('deposit-stars', 'Пополнение Stars');
        this.setupButtonHandler('withdraw-stars', 'Вывод Stars');
        this.setupButtonHandler('request-gift', 'Подарок');
        this.setupButtonHandler('place-bet', 'Ставка');
        this.setupButtonHandler('add-bet', 'Добавить ставку');
    }

    setupButtonHandler(buttonId, title) {
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
        Telegram.WebApp.showPopup({
            title: 'Ошибка',
            message: message,
            buttons: [{ type: 'ok' }]
        });
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 DOM loaded, initializing application...');
    window.app = new GameWebApp();
});

// Аварийный таймаут на случай зависания
setTimeout(function() {
    const loadingScreen = document.getElementById('loading-screen');
    const app = document.getElementById('app');
    
    if (loadingScreen && loadingScreen.style.display !== 'none') {
        console.log('⚠️ Emergency: Force hiding loading screen');
        loadingScreen.style.display = 'none';
    }
    if (app && app.style.display === 'none') {
        app.style.display = 'block';
    }
}, 10000);
