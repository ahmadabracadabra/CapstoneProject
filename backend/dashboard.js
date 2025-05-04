let timer;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isRunning = false;

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById("timer-display").textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

document.getElementById("start-btn").addEventListener("click", function() {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timer);
                alert("⏳ Time’s up! Take a break!");
                isRunning = false;
            }
        }, 1000);
    }
});

document.getElementById("pause-btn").addEventListener("click", function() {
    clearInterval(timer);
    isRunning = false;
});

document.getElementById("reset-btn").addEventListener("click", function() {
    clearInterval(timer);
    timeLeft = 25 * 60;
    updateDisplay();
    isRunning = false;
});

updateDisplay();


document.addEventListener('DOMContentLoaded', () => {
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

if (taskForm) {
taskForm.addEventListener('submit', addTask);
} else {
console.error("task-form not found in DOM.");
}

if (taskList) {
fetchAllTasks();
} else {
console.error("task-list not found in DOM.");
}
});

// fetch and display tasks
async function fetchAllTasks() {
const token = localStorage.getItem('token');
if (!token) {
console.error("No token found in localStorage");
return;
}

try {
//const response = await fetch('http://3.83.241.175:8080/tasks', {
const response = await fetch('http://localhost:8080/tasks', {
    method: 'GET',
    headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

if (!response.ok) throw new Error("Failed to fetch tasks");

const tasks = await response.json();
const taskList = document.getElementById('task-list');
taskList.innerHTML = '';

tasks.forEach(task => {
    taskList.appendChild(createTaskElement(task));
});
} catch (error) {
console.error("Error fetching tasks:", error);
}
}

// add a new task
async function addTask(event) {
event.preventDefault();
const taskInput = document.getElementById('task-input');
const taskText = taskInput.value.trim();
const token = localStorage.getItem('token');

if (!taskText || !token) return;

try {
//const response = await fetch('http://3.83.241.175:8080/tasks', {
const response = await fetch('http://localhost:8080/tasks', {
    method: 'POST',
    headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ task: taskText })
});

if (!response.ok) throw new Error("Failed to create task");

const newTask = await response.json();
document.getElementById('task-list').appendChild(createTaskElement(newTask));
taskInput.value = '';
} catch (error) {
console.error("Error creating task:", error);
}
}

// remove a task
async function removeTask(taskId, taskElement) {
const token = localStorage.getItem('token');

try {
//const response = await fetch(`http://3.83.241.175:8080/tasks/${taskId}`, {
const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
});

if (!response.ok) throw new Error("Failed to delete task");

taskElement.remove();
} catch (error) {
console.error("Error deleting task:", error);
}
}

// Function to create a task element
function createTaskElement(task) {
if (!task.id) {
console.error("Task ID missing:", task);
return;
}

const taskItem = document.createElement('div');
taskItem.className = 'task-item flex items-center justify-between p-3 bg-gray-100 rounded';
taskItem.dataset.id = task.id;

const taskText = document.createElement('span');
taskText.className = 'task-text text-gray-800';
taskText.textContent = task.task || task.task_text; 

const deleteButton = document.createElement('button');
deleteButton.className = 'delete-task text-gray-500 hover:text-red-500';
deleteButton.innerHTML = `
<svg class="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
</svg>
`;

deleteButton.addEventListener('click', () => removeTask(task.id, taskItem));

taskItem.appendChild(taskText);
taskItem.appendChild(deleteButton);

return taskItem;
}



async function fetchDailyQuote() {
const token = localStorage.getItem('token');
if (!token) {
console.error("No token found in localStorage");
return;
}
try {
//const response = await fetch('http://3.83.241.175:8080/quote', {
  const response = await fetch('http://localhost:8080/quote', {
      method: 'GET', 
      headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json', 
      },
  });
  if (!response.ok) {
      throw new Error('Failed to fetch the quote');
  }
  const data = await response.json();
  const quote = data.quote; 
  document.getElementById('quote').textContent = `"${quote}"`; 
} catch (error) {
  console.error('Error fetching daily quote:', error);
}
}

document.addEventListener('DOMContentLoaded', fetchDailyQuote);

async function getUserData() {
const token = localStorage.getItem('token');
if (!token) {
window.location.href = '/login';  
return;
}

try {
const response = await fetch('http://localhost:8080/dashboard', {
method: 'GET',
headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
}
});

if (!response.ok) throw new Error('Failed to fetch user data');

const user = await response.json();
console.log(user);  

document.getElementById("user-name").textContent = user.username || "Unknown User";
document.getElementById("user-email").textContent = user.email || "user@example.com";
document.getElementById("welcomeText").textContent = `Welcome Back, ${user.username || "User"}`;

const avatar = document.getElementById("user-avatar");
if (user.profilePicUrl) {
avatar.src = user.profilePicUrl;
}

} catch (error) {
console.error('Error fetching user data:', error);
}
}

function formatEventDate(dateString) {
const options = { year: 'numeric', month: 'long', day: 'numeric' };
const eventDate = new Date(dateString);
return eventDate.toLocaleDateString('en-US', options);
}

async function fetchUpcomingEvents() {
const token = localStorage.getItem('token');
if (!token) {
window.location.href = '/login';  
return;
}

try {
//const response = await fetch('http://3.83.241.175:8080/events', {
const response = await fetch('http://localhost:8080/events', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
});

if (!response.ok) throw new Error('Failed to fetch events');

const events = await response.json();

const eventsList = document.getElementById('events-list');
eventsList.innerHTML = '';  

events.forEach(event => {
    const listItem = document.createElement('li');
    const formattedDate = formatEventDate(event.event_date);  
    listItem.textContent = `${event.name} (${formattedDate})`; 
    eventsList.appendChild(listItem);
});

} catch (error) {
console.error('Error fetching events:', error);
}
}

async function postAssignment(event) {
event.preventDefault();

const title = document.getElementById("title").value;
const dueDate = document.getElementById("due-date").value;
const className = document.getElementById("class-name").value;
const description = document.getElementById("description").value;
const status = document.getElementById("status").value;
const pointsPossible = document.getElementById("points-possible").value;

console.log(title, dueDate, className, description, status, pointsPossible);

const token = localStorage.getItem("token");

try {
//const response = await fetch('http://3.83.241.175:8080/assignments', {
const response = await fetch("http://localhost:8080/assignments", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
        title, className, dueDate, description, status, pointsPossible
    }),
});

const data = await response.json();

if (response.ok) {
    alert("Assignment created successfully!");
    await fetchAssignments();
} else {
    alert("Error: " + data.error);
}
} catch (error) {
console.error("Error creating assignment:", error);
}
}

async function fetchAssignments() {
const token = localStorage.getItem("token");
try {
//const response = await fetch('http://3.83.241.175:8080/assignments', {
const response = await fetch("http://localhost:8080/assignments", {
method: "GET",
headers: {
    "Authorization": `Bearer ${token}`
}
});

const assignments = await response.json();
const assignmentList = document.getElementById("assignments-list");
assignmentList.innerHTML = "";  

// Sort the assignments by due date 
assignments.sort((a, b) => {
const dueDateA = new Date(a.DueDate);
const dueDateB = new Date(b.DueDate);
return dueDateA - dueDateB;  // ascending
});

assignments.forEach(assignment => {
const assignmentCard = createAssignmentCard(assignment);
assignmentList.appendChild(assignmentCard);
});
} catch (error) {
console.error("Error fetching assignments:", error);
}
}

async function deleteAssignment(assignmentId) {
const token = localStorage.getItem("token");
if (!confirm("Are you sure you want to delete this assignment?")) return;

try {
//const response = await fetch(`http://3.83.241.175:8080/assignments/${assignmentId}`, {
const response = await fetch(`http://localhost:8080/assignments/${assignmentId}`, {
    method: "DELETE",
    headers: {
        "Authorization": `Bearer ${token}`
    }
});

const data = await response.json();

if (response.ok) {
    alert("Assignment deleted successfully!");
    await fetchAssignments();
} else {
    alert("Error: " + data.error);
}
} catch (error) {
console.error("Error deleting assignment:", error);
}
}

function updateStatus(assignmentId) {
const statusSelect = document.getElementById(`status-select-${assignmentId}`);
const newStatus = statusSelect.value;

//fetch(`http://3.83.241.175:8080/assignments/${assignmentId}/status`, {
fetch(`http://localhost:8080/assignments/${assignmentId}/status`, {
method: 'PUT',
headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
},
body: JSON.stringify({ status: newStatus })
})
.then(response => response.json())
.then(data => {
if (data.success) {
    const assignmentCard = document.getElementById(`assignment-card-${assignmentId}`);
    updateCardStatusAndColor(assignmentCard, newStatus);
    alert('Status updated successfully!');
} else {
    alert('Failed to update status');
}
})
.catch(error => {
console.error('Error:', error);
alert('Failed to update status');
});
}

function updateCardStatusAndColor(cardElement, newStatus) {
const statusElement = cardElement.querySelector('.assignment-status');
statusElement.textContent = newStatus;

let cardColorClass = "bg-gray-500";
if (newStatus === "Unstarted") cardColorClass = "bg-yellow-500";
if (newStatus === "In Progress") cardColorClass = "bg-blue-500";
if (newStatus === "Done") cardColorClass = "bg-green-500";

cardElement.classList.remove("bg-yellow-500", "bg-blue-500", "bg-green-500", "bg-gray-500");
cardElement.classList.add(cardColorClass);
}

function createAssignmentCard(assignment) {
const li = document.createElement("li");
li.className = `assignment-card rounded-md mb-4 p-4 text-white relative`;

const formattedDate = new Date(assignment.DueDate).toLocaleDateString('en-US', {
month: 'long',
day: 'numeric',
year: 'numeric'
});

let cardColorClass = "bg-gray-500";
if (assignment.Status === "Unstarted") cardColorClass = "bg-yellow-500";
if (assignment.Status === "In Progress") cardColorClass = "bg-blue-500";
if (assignment.Status === "Done") cardColorClass = "bg-green-500";

li.id = `assignment-card-${assignment.AssignmentID}`;

li.innerHTML = `
<div class="flex justify-between items-start w-full" id="assignment-card-${assignment.AssignmentID}">
<div class="flex flex-col items-start">
<span class="font-bold text-lg">${assignment.Title}</span>
<span class="text-sm text-white">${assignment.Class}</span>
</div>
<button class="text-xl bg-transparent text-white" onclick="deleteAssignment(${assignment.AssignmentID})">X</button>
</div>
<div class="mt-1 text-sm">
<div class="flex items-center">
<span>${assignment.Points_Possible} pts</span>
<span class="mx-2">•</span>
<span>${formattedDate}</span>
</div>
</div>
<div class="description-toggle absolute bottom-4 right-4 text-3xl cursor-pointer">☰</div>
<div class="description-content mt-2 text-gray-200 hidden">
<p>${assignment.Description}</p>
<!-- Add hidden class to the redundant status label -->
<div class="mt-2 text-sm font-semibold assignment-status hidden">Status: ${assignment.Status}</div> 
<div class="mt-2 text-sm font-semibold">
<label for="status-select-${assignment.AssignmentID}">Status: </label>
<select id="status-select-${assignment.AssignmentID}" class="status-select" onchange="updateStatus(${assignment.AssignmentID})">
    <option value="Unstarted" ${assignment.Status === 'Unstarted' ? 'selected' : ''}>Unstarted</option>
    <option value="In Progress" ${assignment.Status === 'In Progress' ? 'selected' : ''}>In Progress</option>
    <option value="Done" ${assignment.Status === 'Done' ? 'selected' : ''}>Done</option>
</select>
</div>
</div>
`;



li.classList.add(cardColorClass);

const descriptionToggle = li.querySelector(".description-toggle");
const descriptionContent = li.querySelector(".description-content");

descriptionToggle.addEventListener("click", () => {
descriptionContent.classList.toggle("hidden");
});

return li;
}

document.addEventListener("DOMContentLoaded", async () => {
await getUserData();
await fetchUpcomingEvents();
await fetchAssignments();
});

document.getElementById("assignment-form").addEventListener("submit", postAssignment);

// Add a new transaction
async function postTransaction(event) {
event.preventDefault();

const item = document.getElementById("item").value;
const category = document.getElementById("category").value;
const amount = parseFloat(document.getElementById("amount").value);
const type = document.getElementById("type").value;
const transactionDate = document.getElementById("transactionDate").value;

const token = localStorage.getItem("token");

console.log("Posting new transaction with the following data:");
console.log("Item:", item);
console.log("Category:", category);
console.log("Amount:", amount);
console.log("Type:", type);
console.log("Transaction Date:", transactionDate);

if (!item || !category || !amount || !type || !transactionDate) {
console.log("Missing required fields: ");
if (!item) console.log("Item is missing.");
if (!category) console.log("Category is missing.");
if (!amount) console.log("Amount is missing.");
if (!type) console.log("Type is missing.");
if (!transactionDate) console.log("Transaction Date is missing.");
alert("Please fill in all required fields.");
return;
}

try {
console.log("Sending POST request to server...");
const response = await fetch("http://localhost:8080/transactions", {
method: "POST",
headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
},
body: JSON.stringify({
    transactionDate,
    category,
    item,
    type,
    amount,
}),
});

const data = await response.json();

if (response.ok) {
console.log("Transaction added successfully!");
alert("Transaction added successfully!");
await fetchTransactions();
} else {
console.error("Error from server:", data.error);
alert("Error: " + data.error);
}
} catch (error) {
console.error("Error adding transaction:", error);
}
}

// Fetch all transactions
async function fetchTransactions() {
const token = localStorage.getItem("token");

console.log("Fetching all transactions...");
try {
const response = await fetch("http://localhost:8080/transactions", {
method: "GET",
headers: {
    "Authorization": `Bearer ${token}`,
},
});

const transactions = await response.json();
const transactionList = document.getElementById("transactionList");
transactionList.innerHTML = ""; 

console.log("Fetched transactions:", transactions);

// Sort transactions by date in descending order 
transactions.sort((a, b) => {
const dateA = new Date(a.transaction_date).getTime();  
const dateB = new Date(b.transaction_date).getTime();  

console.log(`Date A: ${dateA}, Date B: ${dateB}`);

return dateB - dateA; 
});

let total = 0; 

transactions.forEach(transaction => {
const transactionCard = createTransactionCard(transaction);
transactionList.appendChild(transactionCard);

if (transaction.type === 'income') {
    total += parseFloat(transaction.amount);  
} else if (transaction.type === 'expense') {
    total -= parseFloat(transaction.amount); 
}
});

const totalAmountElement = document.getElementById("totalAmount");

if (total < 0) {
totalAmountElement.textContent = `-$${Math.abs(total).toFixed(2)}`; 
totalAmountElement.style.color = 'red'; 
} else {
totalAmountElement.textContent = `$${total.toFixed(2)}`; 
totalAmountElement.style.color = 'green'; 
}

} catch (error) {
console.error("Error fetching transactions:", error);
}
}

// Delete a transaction
async function deleteTransaction(transactionId) {
const token = localStorage.getItem("token");
if (!confirm("Are you sure you want to delete this transaction?")) return;

console.log("Deleting transaction with ID:", transactionId);
try {
const response = await fetch(`http://localhost:8080/transactions/${transactionId}`, {
method: "DELETE",
headers: {
    "Authorization": `Bearer ${token}`,
},
});

const data = await response.json();

if (response.ok) {
console.log("Transaction deleted successfully!");
alert("Transaction deleted successfully!");
await fetchTransactions();
} else {
console.error("Error deleting transaction:", data.error);
alert("Error: " + data.error);
}
} catch (error) {
console.error("Error deleting transaction:", error);
}
}

// Create a transaction card
function createTransactionCard(transaction) {
const div = document.createElement("div");
div.className = `transaction-card p-4 mb-4 rounded-md`;

const formattedAmount = parseFloat(transaction.amount).toFixed(2);
const formattedDate = new Date(transaction.transaction_date).toLocaleDateString('en-US', {
month: 'long',
day: 'numeric',
year: 'numeric'
});

if (transaction.type === 'income') {
div.style.backgroundColor = '#28a745';  
} else {
div.style.backgroundColor = '#dc3545';  
}

div.style.color = 'white';  

div.innerHTML = `
<div class="flex justify-between items-center">
<div class="flex flex-col items-start">
  <span class="font-bold text-lg">${transaction.item}</span>
  <span class="text-sm">${formattedDate}</span>
</div>
<button class="text-xl bg-transparent text-white" onclick="deleteTransaction(${transaction.id})">X</button>
</div>
<div class="mt-1 text-sm flex items-center">
<span>${transaction.type === 'income' ? '💸 Income' : '💳 Expense'}</span>
<span class="mx-1">•</span> <!-- Reduced spacing -->
<span>${transaction.category}</span> <!-- Display category next to the amount -->
<span class="mx-1">•</span> <!-- Reduced spacing -->
<span>$${formattedAmount}</span> <!-- Place $ before the amount -->
</div>
`;

return div;
}
document.addEventListener("DOMContentLoaded", async () => {
console.log("Page loaded. Fetching transactions...");
await fetchTransactions();
});

document.getElementById("transactionForm").addEventListener("submit", postTransaction);

//logout stuff
document.getElementById("logoutButton").addEventListener("click", async function (event) {
event.preventDefault(); 

try {
const token = localStorage.getItem("token");

//const response = await fetch("http://35.174.153.248:8080/logout", {
const response = await fetch("http://localhost:8080/logout", {
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${token}`, 
},
});

if (response.ok) {
localStorage.removeItem("token");
sessionStorage.removeItem("token");

window.location.href = "login.html"; 
} else {
console.error("Logout failed:", await response.json());
}
} catch (error) {
console.error("Error during logout:", error);
}
});

// Function to display notifications
function displayNotifications(notifications) {
const notificationList = document.getElementById('notification-list');
const notificationBadge = document.getElementById('notification-bubble'); // Notification bubble
notificationList.innerHTML = ''; 

const unreadNotifications = notifications.data.filter(notification => !notification.read); 

if (unreadNotifications.length === 0) {
notificationList.innerHTML = '<p class="text-center text-white py-1">None</p>';
notificationBadge.style.display = 'none'; 
return;
}

notificationBadge.style.display = 'inline-flex'; 
notificationBadge.textContent = unreadNotifications.length;
const notificationIDs = [];

unreadNotifications.forEach((notification) => {
const notificationItem = document.createElement('div');
notificationItem.classList.add(
'notification-item',
'p-2',
'mb-2',
'border-b',
'border-gray-200',
'dark:border-gray-600',
'text-white',
'flex', 
'items-center' 
);
notificationItem.style.backgroundColor = '#101828';

const content = document.createElement('div');
content.classList.add('content');
content.textContent = notification.content;

const markReadButton = document.createElement('button');
markReadButton.classList.add('text-blue-500', 'hover:text-blue-700', 'ml-4'); 
markReadButton.textContent = 'Mark Read';

markReadButton.onclick = () => markNotificationAsRead(notification.id, notificationItem, notifications.data);

notificationItem.appendChild(content);
notificationItem.appendChild(markReadButton);

notificationList.appendChild(notificationItem);

notificationIDs.push(notification.id);
});

document.getElementById('clear-all-btn').onclick = () => clearAllNotifications(notificationIDs);
}

// Function to mark a notification as read
async function markNotificationAsRead(notificationID, notificationElement, allNotifications) {
try {
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:8080/notification/mark-read', {
method: 'POST',
headers: {
'Authorization': `Bearer ${token}`,
'Content-Type': 'application/json',
},
body: JSON.stringify({ notificationID }),
});

if (!response.ok) {
throw new Error('Failed to mark notification as read');
}

const data = await response.json();
alert(data.message); 

notificationElement.remove();

const unreadNotifications = allNotifications.filter(notification => !notification.read);
const notificationBadge = document.getElementById('notification-bubble');

notificationBadge.textContent = unreadNotifications.length;

if (unreadNotifications.length === 0) {
notificationBadge.style.display = 'none';
}

} catch (error) {
console.error('Error marking notification as read:', error);
alert('Error marking notification as read');
}
}

// Function to clear all notifications
async function clearAllNotifications() {
try {
const token = localStorage.getItem('token');
const userID = localStorage.getItem('userID'); 

const response = await fetch('http://localhost:8080/notifications/clear-all', {
method: 'POST',
headers: {
'Authorization': `Bearer ${token}`,
'Content-Type': 'application/json',
},
body: JSON.stringify({ userID }),
});

if (!response.ok) {
throw new Error('Failed to clear notifications');
}

const data = await response.json();
alert(data.message); 

document.getElementById('notification-list').innerHTML = '<p>No notifications</p>';
} catch (error) {
console.error('Error clearing notifications:', error);
alert('Error clearing notifications');
}
}

document.getElementById('clear-all-btn').addEventListener('click', clearAllNotifications);


async function fetchNotifications() {
try {
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:8080/notifications', {
method: 'GET',
headers: {
'Authorization': `Bearer ${token}`,
'Content-Type': 'application/json',
},
});

if (!response.ok) {
throw new Error('Failed to fetch notifications');
}

const notifications = await response.json();
console.log('Notifications:', notifications); 
displayNotifications(notifications);
} catch (error) {
console.error('Error fetching notifications:', error);
}
}

window.onload = function() {
const notificationDropdown = document.getElementById('notification-dropdown');
notificationDropdown.classList.add('hidden');
fetchNotifications();
};
