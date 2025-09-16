class GameWebApp {
    constructor() {
        this.currentPage = 'home-page';
        this.isLoading = true;
        this.init();
    }

    async init() {
        try {
            this.showLoadingScreen();
            
            Telegram.WebApp.ready();
            Telegram.WebApp.expand();
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const telegramUser = Telegram.WebApp.initDataUnsafe.user;
            console.log('Telegram user data:', telegramUser);
            
            if (!telegramUser || !telegramUser.id) {
                throw new Error('Данные пользователя Telegram не получены');
            }
            
            // Немедленно показываем данные
            userProfile.updateProfileUI(telegramUser);
            
            await Promise.all([
                userProfile.init(telegramUser),
                telegramStars.init(telegramUser.id)
            ]);
            
            this.setupEventListeners();
            
            // ЯВНО инициализируем навигацию
            this.initializeNavigation();
            
            setTimeout(() => {
                this.hideLoadingScreen();
                this.isLoading = false;
                console.log('App initialized successfully');
            }, 1500);
            
        } catch (error) {
            console.error('App initialization error:', error);
            this.showError(error.message);
            this.hideLoadingScreen();
        }
    }

    initializeNavigation() {
        console.log('Initializing navigation...');
        
        // Находим все элементы
        const navButtons = document.querySelectorAll('.nav-btn');
        const pages = document.querySelectorAll('.page');
        
        console.log('Found nav buttons:', navButtons.length);
        console.log('Found pages:', pages.length);
        
        // Скрываем все страницы кроме главной
        pages.forEach(page => {
            if (page.id === 'home-page') {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });
        
        // Активируем кнопку главной страницы
        navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-page') === 'home-page') {
                btn.classList.add('active');
                console.log('Activated home button');
            }
        });
    }

    navigateTo(pageId) {
        console.log('Navigating to:', pageId);
        
        // Скрываем все страницы
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
            console.log('Hiding page:', page.id);
        });
        
        // Показываем выбранную страницу
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            console.log('Showing page:', pageId);
            this.currentPage = pageId;
        }
        
        // Обновляем активную кнопку навигации
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            console.log('Deactivating button:', btn.getAttribute('data-page'));
        });
        
        const activeBtn = document.querySelector(`.nav-btn[data-page="${pageId}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            console.log('Activating button:', pageId);
        } else {
            console.error('Button not found for page:', pageId);
        }
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        const navButtons = document.querySelectorAll('.nav-btn');
        console.log('Navigation buttons found:', navButtons.length);
        
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.getAttribute('data-page');
                console.log('Button clicked, page:', page);
                this.navigateTo(page);
            });
        });

        // Простые обработчики для кнопок
        const addClickListener = (id, action) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', action);
                console.log('Listener added for:', id);
            } else {
                console.error('Element not found:', id);
            }
        };

        addClickListener('deposit-ton', () => this.showPopup('Пополнение TON', 'Функция в разработке'));
        addClickListener('withdraw-ton', () => this.showPopup('Вывод TON', 'Функция в разработке'));
        addClickListener('deposit-stars', () => this.showPopup('Пополнение Stars', 'Функция в разработке'));
        addClickListener('withdraw-stars', () => this.showPopup('Вывод Stars', 'Функция в разработке'));
        addClickListener('request-gift', () => this.showPopup('Подарок', 'Функция в разработке'));
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

    showPopup(title, message) {
        Telegram.WebApp.showPopup({
            title: title,
            message: message,
            buttons: [{ type: 'ok' }]
        });
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff4444;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            max-width: 80%;
            text-align: center;
        `;
        errorDiv.textContent = `Ошибка: ${message}`;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => errorDiv.remove(), 5000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    window.app = new GameWebApp();
});
