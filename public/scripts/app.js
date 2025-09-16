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
            
            // Показываем данные Telegram в консоли для отладки
            console.log('Telegram initData:', Telegram.WebApp.initData);
            console.log('Telegram user data:', Telegram.WebApp.initDataUnsafe.user);
            
            // Ждем немного для инициализации Telegram
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Проверяем, есть ли данные пользователя
            const telegramUser = Telegram.WebApp.initDataUnsafe.user;
            if (!telegramUser) {
                throw new Error('Данные пользователя Telegram не получены');
            }
            
            // Инициализируем профиль с данными Telegram
            await userProfile.init(telegramUser);
            await telegramStars.init(telegramUser.id);
            
            this.setupEventListeners();
            
            // Скрываем загрузку через 2 секунды
            setTimeout(() => {
                this.hideLoadingScreen();
                this.isLoading = false;
            }, 2000);
            
        } catch (error) {
            console.error('Ошибка инициализации:', error);
            this.showError('Не удалось загрузить данные пользователя');
            this.hideLoadingScreen();
        }
    }

    showLoadingScreen() {
        document.getElementById('loading-screen').classList.remove('hidden');
        document.getElementById('app').classList.add('hidden');
    }

    hideLoadingScreen() {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
    }

    showError(message) {
        Telegram.WebApp.showPopup({
            title: 'Ошибка',
            message: message,
            buttons: [{ type: 'ok' }]
        });
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
        document.getElementById('deposit-ton')?.addEventListener('click', () => {
            this.showTONDepositModal();
        });
        
        document.getElementById('withdraw-ton')?.addEventListener('click', () => {
            this.showTONWithdrawModal();
        });
        
        document.getElementById('deposit-stars')?.addEventListener('click', () => {
            this.depositStars();
        });
        
        document.getElementById('withdraw-stars')?.addEventListener('click', () => {
            this.withdrawStars();
        });
        
        document.getElementById('request-gift')?.addEventListener('click', () => {
            this.requestGift();
        });
    }

    navigateTo(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
        }
    }

    showTONDepositModal() {
        Telegram.WebApp.showPopup({
            title: 'Пополнение TON',
            message: 'Функция пополнения в разработке',
            buttons: [{ type: 'ok' }]
        });
    }

    showTONWithdrawModal() {
        Telegram.WebApp.showPopup({
            title: 'Вывод TON',
            message: 'Функция вывода в разработке',
            buttons: [{ type: 'ok' }]
        });
    }

    depositStars() {
        Telegram.WebApp.showPopup({
            title: 'Пополнение Stars',
            message: 'Функция пополнения в разработке',
            buttons: [{ type: 'ok' }]
        });
    }

    withdrawStars() {
        Telegram.WebApp.showPopup({
            title: 'Вывод Stars',
            message: 'Функция вывода в разработке',
            buttons: [{ type: 'ok' }]
        });
    }

    requestGift() {
        Telegram.WebApp.showPopup({
            title: 'Подарок',
            message: 'Функция подарков в разработке',
            buttons: [{ type: 'ok' }]
        });
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.app = new GameWebApp();
});
