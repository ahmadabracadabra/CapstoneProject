class BudgetTracker {
    constructor() {
      this.transactions = this.loadTransactions();
      this.form = document.getElementById("transactionForm");
      this.transactionList = document.getElementById("transactionList");
      this.balanceElement = document.getElementById("balance");
  
      this.initEventListeners();
      this.initChart();
      this.renderTransactions();
      this.updateBalance();
      this.updateChart();
    }
  
    loadTransactions() {
      return JSON.parse(localStorage.getItem("transactions")) || [];
    }
  
    saveTransactions() {
      localStorage.setItem("transactions", JSON.stringify(this.transactions));
    }
  
    initEventListeners() {
      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.addTransaction();
      });
    }
  
    clearForm() {
      document.getElementById("description").value = "";
      document.getElementById("amount").value = "";
    }
  
    addTransaction() {
      const description = document.getElementById("description").value.trim();
      const amount = parseFloat(document.getElementById("amount").value);
      const type = document.getElementById("type").value;
  
      if (!description || isNaN(amount)) {
        alert("Please provide a valid description and amount.");
        return;
      }
  
      const transaction = {
        id: Date.now(),
        description,
        amount: type === "expense" ? -amount : amount,
        type,
      };
  
      this.transactions.push(transaction);
      this.saveTransactions();
      this.renderTransactions();
      this.updateBalance();
      this.clearForm();
      this.updateChart();
    }
  
    renderTransactions() {
      this.transactionList.innerHTML = "";
      this.transactions
        .slice()
        .sort((a, b) => b.id - a.id)
        .forEach((transaction) => {
          const transactionDiv = document.createElement("div");
          transactionDiv.classList.add("transaction", transaction.type);
          transactionDiv.innerHTML = `
              <span>${transaction.description}</span>
              <span class="transaction-amount-container"
                >$${Math.abs(transaction.amount).toFixed(
                  2
                )} <button class="delete-btn" data-id="${
            transaction.id
          }">Delete</button></span
              >
          `;
          this.transactionList.appendChild(transactionDiv);
        });
      this.attachDeleteEventListeners();
    }
  
    attachDeleteEventListeners() {
      this.transactionList.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", () => {
          this.deleteTransaction(Number(button.dataset.id));
        });
      });
    }
  
    deleteTransaction(id) {
      this.transactions = this.transactions.filter(
        (transaction) => transaction.id !== id
      );
  
      this.saveTransactions();
      this.renderTransactions();
      this.updateBalance();
      this.updateChart();
    }
  
    updateBalance() {
      const balance = this.transactions.reduce(
        (total, transaction) => total + transaction.amount,
        0
      );
  
      this.balanceElement.textContent = `Balance: $${balance.toFixed(2)}`;
      this.balanceElement.style.color = balance >= 0 ? "#2ecc71" : "#e74c3c";
    }

    initChart() {
      const ctx = document.getElementById("doughnutChart").getContext("2d");
    
      this.doughnutChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Income", "Expense"],
          datasets: [{
            data: [0, 0],
            backgroundColor: ["#2ecc71", "#e74c3c"],
            borderWidth: 1,
          }],
        },
        options: {
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: "#fff",
              },
            },
          },
        },
      });
    }
    
    updateChart() {
      const income = this.transactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
    
      const expense = this.transactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
      this.doughnutChart.data.datasets[0].data = [income, expense];
      this.doughnutChart.update();
    }
  }
  
  const budgetTracker = new BudgetTracker();