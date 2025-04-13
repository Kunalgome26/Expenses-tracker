let totalAmount = 0;
let savings = 0;
let transactions = [];

const balanceEl = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const dateInput = document.getElementById("date");
const monthlyTotal = document.getElementById("monthly-total");

form.addEventListener("submit", addTransaction);

function setTotalAmount() {
  const amountInput = document.getElementById('totalAmount').value;
  if (amountInput === "" || isNaN(amountInput)) {
    alert("Please enter a valid total amount.");
    return;
  }
  totalAmount = parseFloat(amountInput);
  updateValues();
}

function addTransaction(e) {
  e.preventDefault();
  const desc = text.value;
  const amt = +amount.value;
  const date = dateInput.value;

  if (desc.trim() === '' || isNaN(amt) || date === "") {
    alert("Please fill in all fields correctly.");
    return;
  }

  const transaction = {
    id: Math.floor(Math.random() * 1000000),
    text: desc,
    amount: -Math.abs(amt),
    date
  };

  transactions.push(transaction);
  addTransactionDOM(transaction);
  updateValues();
  updateChart();
  form.reset();
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");
  item.innerHTML = `${transaction.text} <span>${sign}₹${Math.abs(transaction.amount)}</span>`;
  list.appendChild(item);
}

function addSaving() {
  const savingInput = document.getElementById('saving-amount');
  const amt = parseFloat(savingInput.value);
  if (!isNaN(amt) && amt > 0) {
    savings += amt;
    savingInput.value = '';
    updateValues();
    updateChart();
  }
}

function updateValues() {
  const spent = transactions.reduce((acc, item) => acc + Math.abs(item.amount), 0);
  const balance = totalAmount - spent;

  balanceEl.innerText = `₹${balance.toFixed(2)}`;
  money_plus.innerText = `₹${savings.toFixed(2)}`;
  money_minus.innerText = `₹${spent.toFixed(2)}`;
  monthlyTotal.innerText = `₹${spent.toFixed(2)}`;
}

// PIE CHART
const chart = new Chart(document.getElementById("chart").getContext("2d"), {
  type: "doughnut",
  data: {
    labels: ["Savings", "Expense"],
    datasets: [{
      label: "Money Flow",
      data: [0, 0],
      backgroundColor: ["#00cc66", "#ff4d4d"],
      borderWidth: 1,
    }],
  },
  options: {
    responsive: true,
    animation: { animateScale: true }
  }
});

function updateChart() {
  const expense = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  chart.data.datasets[0].data = [savings, expense];
  chart.update();
}

// THEME TOGGLE
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById('themeToggle');
  body.classList.toggle('dark-mode');
  body.classList.toggle('light-mode');
  btn.innerText = body.classList.contains('dark-mode') ? "☀️ Light Mode" : "🌙 Dark Mode";
}
