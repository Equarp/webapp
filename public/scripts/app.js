class GameWebApp {
    constructor() {
        console.log('🚀 App constructor called');
        this.init();
    }

    async init() {
        console.log('🔄 Initialization started');
        
        try {
            // НЕМЕДЛЕННО показываем что приложение запускается
            this.showLoadingScreen();
            
            // Даем время на отрисовку загрузки
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Простейшая инициализация Telegram
            console.log('📱 Initializing Telegram...');
            
            if (typeof Telegram === 'undefined') {
                throw new Error('Telegram WebApp not loaded');
            }
            
            Telegram.WebApp.ready();
            Telegram.WebApp.expand();
            console.log('✅ Telegram expanded to fullscreen');
            
            // Ждем немного
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Проверяем данные пользователя
            const userData = Telegram.WebApp.initDataUnsafe.user;
            console.log('👤 User data:', userData);
            
            if (userData) {
                this.updateUserProfile(userData);
            }
            
            // Базовая навигация
            this.setupBasicNavigation();
            
            // Скрываем загрузку через 2 секунды
            setTimeout(() => {
                console.log('🔄 Hiding loading screen');
                this.hideLoadingScreen();
            }, 2000);
            
        } catch (error) {
            console.error('❌ Init error:', error);
            // ВСЕГДА скрываем загрузку при ошибке
            this.hideLoadingScreen();
        }
    }

    updateUserProfile(userData) {
        try {
            const nameElement = document.getElementById('user-name');
            const avatarElement = document.getElementById('user-avatar');
            
            if (nameElement) {
                nameElement.textContent = userData.first_name || 'User';
            }
            
            if (avatarElement && userData.photo_url) {
                avatarElement.src = userData.photo_url;
            }
        } catch (error) {
            console.warn('Profile update error:', error);
        }
    }

    setupBasicNavigation() {
        try {
            const buttons = document.querySelectorAll('.nav-btn');
            buttons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const pageId = btn.getAttribute('data-page');
                    console.log('Navigating to:', pageId);
                    
                    // Просто показываем alert для теста
                    alert('Navigation: ' + pageId);
                });
            });
        } catch (error) {
            console.warn('Navigation setup error:', error);
        }
    }

    showLoadingScreen() {
        try {
            const loading = document.getElementById('loading-screen');
            const app = document.getElementById('app');
            
            if (loading) loading.style.display = 'flex';
            if (app) app.style.display = 'none';
        } catch (error) {
            console.error('Show loading error:', error);
        }
    }

    hideLoadingScreen() {
        try {
            const loading = document.getElementById('loading-screen');
            const app = document.getElementById('app');
            
            if (loading) loading.style.display = 'none';
            if (app) app.style.display = 'block';
            
            console.log('✅ Loading screen hidden, app visible');
        } catch (error) {
            console.error('Hide loading error:', error);
        }
    }
}

// АБСОЛЮТНО надежный запуск
console.log('🎯 Script loaded, starting app...');

// Запуск когда DOM готов
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📋 DOM ready, creating app instance');
        window.app = new GameWebApp();
    });
} else {
    // DOM уже готов
    console.log('⚡ DOM already ready, creating app instance');
    window.app = new GameWebApp();
}

// АВАРИЙНЫЙ ТАЙМАУТ - всегда скрывает загрузку через 5 секунд
setTimeout(() => {
    console.log('⏰ Emergency timeout - forcing app show');
    const loading = document.getElementById('loading-screen');
    const app = document.getElementById('app');
    
    if (loading) loading.style.display = 'none';
    if (app) app.style.display = 'block';
}, 5000);
