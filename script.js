// Глобальные переменные для хранения текущих курсов
let currentRates = {
    RUB: 1.00,
    USD: 0.00,
    DBL: 0.00
};

// Загрузка баланса карты из localStorage
function loadCardBalance() {
    const balance = parseFloat(localStorage.getItem('cardBalance')) || 0.00;
    document.getElementById('card-balance').textContent = balance.toFixed(2);
    return balance;
}

// Сохранение баланса карты в localStorage
function saveCardBalance(balance) {
    localStorage.setItem('cardBalance', balance);
    document.getElementById('card-balance').textContent = balance.toFixed(2);
}

// Показать форму входа
function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}

// Показать форму регистрации
function showRegister() {
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
}

// Функция входа
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const storedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];

    const user = storedAccounts.find(account => account.username === username && account.password === password);

    if (user) {
        alert(`Добро пожаловать, ${username}!`);
        document.getElementById('login-form').style.display = 'none';
    } else {
        alert('Неверное имя пользователя или пароль.');
    }
}

// Функция регистрации
function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const storedAccounts = JSON.parse(localStorage.getItem('accounts')) || [];

    if (storedAccounts.some(account => account.username === username)) {
        alert('Пользователь с таким именем уже существует.');
        return;
    }

    if (username && password) {
        storedAccounts.push({ username, password });
        localStorage.setItem('accounts', JSON.stringify(storedAccounts));
        alert(`Регистрация успешна, ${username}!`);
        document.getElementById('register-form').style.display = 'none';
    } else {
        alert('Пожалуйста, заполните все поля.');
    }
}

// Финансовый Бумболашка
function getFinancialAdvice() {
    const adviceList = [
        "Старайся откладывать 10% от каждого дохода на сбережения!",
        "Планируй бюджет на месяц вперед, чтобы избежать лишних трат.",
        "Инвестируй в то, что понимаешь — это снизит риски.",
        "Создай финансовую подушку на 3-6 месяцев расходов.",
        "Не держи все деньги в одной валюте — диверсифицируй!"
    ];
    const randomAdvice = adviceList[Math.floor(Math.random() * adviceList.length)];
    document.getElementById('assistant-message').textContent = randomAdvice;
}

// Обновление курсов валют
function updateExchangeRates() {
    currentRates.RUB = 1.00;
    currentRates.USD = (Math.random() * (0.014 - 0.010) + 0.010).toFixed(4);
    currentRates.DBL = (Math.random() * (0.020 - 0.015) + 0.015).toFixed(4);

    document.getElementById('rub-rate').textContent = currentRates.RUB;
    document.getElementById('usd-rate').textContent = currentRates.USD;
    document.getElementById('dbl-rate').textContent = currentRates.DBL;
}

// Загрузка истории конвертаций из localStorage
function loadConversionHistory() {
    const historyList = document.getElementById('history-list');
    const history = JSON.parse(localStorage.getItem('conversionHistory')) || [];

    historyList.innerHTML = '';
    history.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = entry;
        historyList.appendChild(li);
    });
}

// Сохранение конвертации в localStorage
function saveConversionHistory(entry) {
    const history = JSON.parse(localStorage.getItem('conversionHistory')) || [];
    history.push(entry);
    if (history.length > 10) history.shift();
    localStorage.setItem('conversionHistory', JSON.stringify(history));
    loadConversionHistory();
}

// Конвертация валют
function convertCurrency() {
    const amount = parseFloat(document.getElementById('amount').value);
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    const resultElement = document.getElementById('conversion-result');

    if (isNaN(amount) || amount <= 0) {
        resultElement.textContent = 'Пожалуйста, введите корректную сумму.';
        resultElement.classList.remove('show');
        setTimeout(() => resultElement.classList.add('show'), 10);
        return;
    }

    if (fromCurrency === toCurrency) {
        const resultText = `${amount} ${fromCurrency} = ${amount.toFixed(2)} ${toCurrency} (валюты одинаковы)`;
        resultElement.textContent = resultText;
        resultElement.classList.remove('show');
        setTimeout(() => resultElement.classList.add('show'), 10);
        saveConversionHistory(resultText);
        return;
    }

    const amountInRUB = amount * currentRates[fromCurrency];
    const convertedAmount = amountInRUB / currentRates[toCurrency];

    const resultText = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
    resultElement.textContent = resultText;
    resultElement.classList.remove('show');
    setTimeout(() => resultElement.classList.add('show'), 10);

    saveConversionHistory(resultText);
}

// Внесение денег на карту
function deposit() {
    const amount = parseFloat(document.getElementById('transaction-amount').value);
    if (isNaN(amount) || amount <= 0) {
        alert('Пожалуйста, введите корректную сумму.');
        return;
    }

    let balance = loadCardBalance();
    balance += amount;
    saveCardBalance(balance);
    alert(`Успешно внесено ${amount.toFixed(2)} RUB. Новый баланс: ${balance.toFixed(2)} RUB`);
    document.getElementById('transaction-amount').value = '';
}

// Вывод денег с карты
function withdraw() {
    const amount = parseFloat(document.getElementById('transaction-amount').value);
    if (isNaN(amount) || amount <= 0) {
        alert('Пожалуйста, введите корректную сумму.');
        return;
    }

    let balance = loadCardBalance();
    if (amount > balance) {
        alert('Недостаточно средств на карте.');
        return;
    }

    balance -= amount;
    saveCardBalance(balance);
    alert(`Успешно выведено ${amount.toFixed(2)} RUB. Новый баланс: ${balance.toFixed(2)} RUB`);
    document.getElementById('transaction-amount').value = '';
}

// Обновляем курсы валют каждые 5 минут (300000 миллисекунд)
setInterval(updateExchangeRates, 300000);

// Первоначальное обновление курсов, загрузка истории и баланса
updateExchangeRates();
loadConversionHistory();
loadCardBalance();

// Генерация ID карты
function generateCardId() {
    const cardId = Math.floor(1000000000 + Math.random() * 9000000000);
    document.getElementById('generated-id').textContent = cardId;
}

// Переворот карты
function flipCard() {
    const card = document.getElementById('card');
    card.classList.toggle('flipped');
}

// Регистрация Service Worker для PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}