class TONWallet {
    constructor() {
        this.connector = null;
        this.wallet = null;
        this.connected = false;
        this.init();
    }

    async init() {
        try {
            this.connector = new TonConnectUI({
                manifestUrl: 'https://raw.githubusercontent.com/ton-connect/manifest/main/tonconnect-manifest.json',
                buttonRootId: 'ton-connect-ui'
            });

            const connectedWallets = this.connector.wallet;
            if (connectedWallets) {
                this.wallet = connectedWallets;
                this.connected = true;
                this.onWalletConnected();
            }

            this.connector.onStatusChange(wallet => {
                if (wallet) {
                    this.wallet = wallet;
                    this.connected = true;
                    this.onWalletConnected();
                } else {
                    this.connected = false;
                    this.wallet = null;
                    this.onWalletDisconnected();
                }
            });
        } catch (error) {
            console.error('Ошибка инициализации TON кошелька:', error);
        }
    }

    onWalletConnected() {
        console.log('TON кошелек подключен:', this.wallet);
        document.dispatchEvent(new CustomEvent('walletConnected', { 
            detail: { address: this.wallet.account.address } 
        }));
    }

    onWalletDisconnected() {
        console.log('TON кошелек отключен');
        document.dispatchEvent(new CustomEvent('walletDisconnected'));
    }

    async getBalance() {
        if (!this.connected) {
            throw new Error('Кошелек не подключен');
        }

        try {
            const provider = this.connector.provider;
            const balance = await provider.getBalance(this.wallet.account.address);
            return parseFloat(balance) / 1000000000;
        } catch (error) {
            console.error('Ошибка получения баланса:', error);
            throw error;
        }
    }

    async sendTransaction(toAddress, amount, payload = null) {
        if (!this.connected) {
            throw new Error('Кошелек не подключен');
        }

        try {
            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 300,
                messages: [
                    {
                        address: toAddress,
                        amount: (amount * 1000000000).toString(),
                        payload: payload
                    }
                ]
            };

            const result = await this.connector.sendTransaction(transaction);
            return result;
        } catch (error) {
            console.error('Ошибка отправки транзакции:', error);
            throw error;
        }
    }

    async depositToApp(amount) {
        try {
            const user = Telegram.WebApp.initDataUnsafe.user;
            await db.createTransaction(user.id, 'deposit', 'ton', amount, 'pending');
            return { success: true, message: 'Запрос на пополнение отправлен' };
        } catch (error) {
            console.error('Ошибка пополнения баланса:', error);
            throw error;
        }
    }

    async withdrawFromApp(amount, toAddress) {
        try {
            const user = Telegram.WebApp.initDataUnsafe.user;
            await db.createTransaction(user.id, 'withdraw', 'ton', amount, 'pending');
            return { success: true, message: 'Запрос на вывод отправлен' };
        } catch (error) {
            console.error('Ошибка вывода средств:', error);
            throw error;
        }
    }
}

const tonWallet = new TONWallet();