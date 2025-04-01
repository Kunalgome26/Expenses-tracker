const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const ctx = document.getElementById("chart");

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];
let myChart;

function addTransaction(e) {
    e.preventDefault();
    if(text.value.trim() === '' || amount.value.trim() === '') {
        alert('please add text and amount');
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value
        }

        transactions.push(transaction);
        addTransactionDOM(transaction);
        updateValues();
        updateChart();
        updateLocalStorage();
        text.value = '';
        amount.value = '';
    }
}

function generateID() {
    return Math.floor(Math.random()*1000000000);
}

function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("li");

    item.classList.add(transaction.amount < 0 ? "minus" : "plus");

    item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;
    list.appendChild(item);
}

function updateValues() {
    const amounts = transactions.map((transaction) => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts.filter((item) => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
    const expense = (amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

    balance.innerText=`$${total}`;
    money_plus.innerText = `+$${income}`;
    money_minus.innerText = `-$${expense}`;
}

function updateChart() {
    const amounts = transactions.map(transaction => transaction.amount);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0);
    const expense = amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1;

    if (myChart) {
        myChart.data.datasets[0].data = [income, expense];
        myChart.update();
    } else {
        myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Income', 'Expense'],
                datasets: [{
                    data: [income, expense],
                    backgroundColor: [
                        '#2ecc71',
                        '#c0392b'
                    ],
                    borderColor: [
                        '#fff',
                        '#fff'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    Init();
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function Init() {
    list.innerHTML = "";
    transactions.forEach(addTransactionDOM);
    updateValues();
    updateChart();
}

Init();

form.addEventListener('submit', addTransaction);

// Enhanced print functionality
window.onbeforeprint = function() {
    // Force chart to render at full size before printing
    if (myChart) {
        myChart.options.responsive = false;
        myChart.resize(600, 400);
        myChart.update();
    }
};

window.onafterprint = function() {
    // Restore responsive behavior after printing
    if (myChart) {
        myChart.options.responsive = true;
        myChart.resize();
        myChart.update();
    }
};
