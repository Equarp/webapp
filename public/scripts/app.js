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
            
            // Инициализация Telegram WebApp
            Telegram.WebApp.ready();
            Telegram.WebApp.expand(); // Это развернет на полный экран
            
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
                this.isLoading = false;
                console.log('✅ Application initialized successfully');
            }, 1500);
            
        } catch (error) {
            console.error('Initialization error:', error);
            this.hideLoadingScreen();
            this.showError(error.message);
        }
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
            }
        }
    }

    initializeNavigation() {
        this.showPage('home');
        this.activateNavButton('home');
    }

    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        const pageElement = document.getElementById(`${pageId}-page`);
        if (pageElement) {
            pageElement.classList.add('active');
            this.currentPage = pageId;
        }
    }

    activateNavButton(pageId) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeButton = document.querySelector(`[data-page="${pageId}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    setupEventListeners() {
        document.querySelectorAll('.nav-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = e.currentTarget.getAttribute('data-page');
                this.showPage(pageId);
                this.activateNavButton(pageId);
            });
        });

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

document.addEventListener('DOMContentLoaded', () => {
    window.app = new GameWebApp();
});
