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
            
            await userProfile.init();
            await telegramStars.init();
            
            this.setupEventListeners();
            
            setTimeout(() => {
                this.hideLoadingScreen();
                this.isLoading = false;
            }, 3000);
            
        } catch (error) {
            console.error('Ошибка инициализации приложения:', error);
            this.hideLoadingScreen();
        }
    }

showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const app = document.getElementById('app');
    
    if (loadingScreen) loadingScreen.classList.remove('hidden');
    if (app) app.classList.add('hidden');
    
    // Резервная проверка - если GIF не загрузится
    setTimeout(() => {
        const loadingImage = document.querySelector('.loading-image');
        if (loadingImage && loadingImage.complete && loadingImage.naturalHeight === 0) {
            // Если изображение не загрузилось, переключаем на CSS анимацию
            loadingImage.style.display = 'none';
            const cssLoader = document.createElement('div');
            cssLoader.className = 'loading-image';
            loadingImage.parentNode.insertBefore(cssLoader, loadingImage);
        }
    }, 1000);
}

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        if (loadingScreen) loadingScreen.classList.add('hidden');
        if (app) app.classList.remove('hidden');
    }

    setupEventListeners() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const page = e.currentTarget.getAttribute('data-page');
                this.navigateTo(page);
            });
        });
        
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
        
        document.querySelector('.close')?.addEventListener('click', () => {
            this.hideModal('ton-connect-modal');
        });
        
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.add('hidden');
            }
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
        
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`.nav-btn[data-page="${pageId}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    showTONDepositModal() {
        const modal = document.getElementById('ton-connect-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    showTONWithdrawModal() {
        const amount = prompt('Введите сумму для вывода:');
        if (amount && !isNaN(amount)) {
            const address = prompt('Введите адрес TON кошелька:');
            if (address) {
                userProfile.withdrawTON(parseFloat(amount), address)
                    .then(result => {
                        alert(result.message);
                    })
                    .catch(error => {
                        alert('Ошибка: ' + error.message);
                    });
            }
        }
    }

    depositStars() {
        const amount = prompt('Введите сумму Stars для пополнения:');
        if (amount && !isNaN(amount)) {
            telegramStars.deposit(parseFloat(amount))
                .catch(error => {
                    alert('Ошибка: ' + error.message);
                });
        }
    }

    withdrawStars() {
        const amount = prompt('Введите сумму Stars для вывода:');
        if (amount && !isNaN(amount)) {
            telegramStars.withdraw(parseFloat(amount))
                .then(result => {
                    alert(result.message);
                })
                .catch(error => {
                    alert('Ошибка: ' + error.message);
                });
        }
    }

    requestGift() {
        userProfile.requestGift()
            .then(result => {
                if (result.success) {
                    alert(`Запрос подарка отправлен! Код: ${result.code}`);
                } else {
                    alert('Ошибка: ' + result.message);
                }
            })
            .catch(error => {
                alert('Ошибка: ' + error.message);
            });
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GameWebApp();

});
