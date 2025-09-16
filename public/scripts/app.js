class GameWebApp {
    constructor() {
        this.currentPage = 'home-page';
        this.isLoading = true;
        this.init();
    }

    async init() {
        try {
            this.showLoadingScreen();
            
            // Инициализируем Telegram WebApp
            Telegram.WebApp.ready();
            Telegram.WebApp.expand();
            
            // Ждем немного для инициализации Telegram
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Получаем данные пользователя из Telegram
            const telegramUser = Telegram.WebApp.initDataUnsafe.user;
            console.log('🔍 Telegram user data:', telegramUser);
            
            if (!telegramUser || !telegramUser.id) {
                throw new Error('Данные пользователя Telegram не получены. Проверьте настройки бота.');
            }
            
            // НЕМЕДЛЕННО показываем данные из Telegram
            userProfile.updateProfileUI(telegramUser);
            
            // Инициализируем остальные модули
            await Promise.all([
                userProfile.init(telegramUser),
                telegramStars.init(telegramUser.id)
            ]);
            
            this.setupEventListeners();
            
            // Скрываем загрузку
            setTimeout(() => {
                this.hideLoadingScreen();
                this.isLoading = false;
                console.log('✅ App initialized successfully');
            }, 1500);
            
        } catch (error) {
            console.error('❌ App initialization error:', error);
            this.showError(error.message);
            this.hideLoadingScreen();
        }
    }

showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const app = document.getElementById('app');
    
    if (loadingScreen) {
        loadingScreen.classList.remove('hidden');
        loadingScreen.style.display = 'flex';
    }
    if (app) {
        app.classList.add('hidden');
        app.style.display = 'none';
    }
}

hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const app = document.getElementById('app');
    
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        // Не скрываем сразу, даем анимации завершиться
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
    if (app) {
        app.classList.remove('hidden');
        app.style.display = 'block';
        // Добавляем анимацию появления
        app.classList.add('slide-in');
    }
}

    showError(message) {
        // Создаем элемент для отображения ошибки
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
        
        // Удаляем через 5 секунд
        setTimeout(() => errorDiv.remove(), 5000);
    }

    setupEventListeners() {
        // Навигация
        document.querySelectorAll('.nav-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const page = e.currentTarget.getAttribute('data-page');
                this.navigateTo(page);
            });
        });

        // Кнопки управления балансом
        const setupButton = (id, action) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', action);
            }
        };

        setupButton('deposit-ton', () => this.showPopup('Пополнение TON', 'Функция в разработке'));
        setupButton('withdraw-ton', () => this.showPopup('Вывод TON', 'Функция в разработке'));
        setupButton('deposit-stars', () => this.showPopup('Пополнение Stars', 'Функция в разработке'));
        setupButton('withdraw-stars', () => this.showPopup('Вывод Stars', 'Функция в разработке'));
        setupButton('request-gift', () => this.showPopup('Подарок', 'Функция в разработке'));
    }

    showPopup(title, message) {
        Telegram.WebApp.showPopup({
            title: title,
            message: message,
            buttons: [{ type: 'ok' }]
        });
    }

navigateTo(pageId) {
    // Скрываем все страницы
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Показываем выбранную страницу с анимацией
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        targetPage.classList.add('slide-in');
        this.currentPage = pageId;
        
        // Убираем класс анимации после завершения
        setTimeout(() => {
            targetPage.classList.remove('slide-in');
        }, 500);
    }
    
    // Обновляем активную кнопку навигации
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.remove('neon-glow');
    });
    
    const activeBtn = document.querySelector(`.nav-btn[data-page="${pageId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.classList.add('neon-glow');
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded, initializing app...');
    window.app = new GameWebApp();
});


