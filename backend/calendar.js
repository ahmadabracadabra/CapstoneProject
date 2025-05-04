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
    
    document.getElementById("user-name").textContent = user.username || "Unknown User";
    document.getElementById("user-email").textContent = user.email || "user@example.com";
    const avatar = document.getElementById("user-avatar");
    if (user.profilePicUrl) {
        avatar.src = user.profilePicUrl;
    }

  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}

window.onload = function() {
  getUserData();
  const notificationDropdown = document.getElementById('notification-dropdown');
  notificationDropdown.classList.add('hidden');
  fetchNotifications();
};

//logout stuff
document.getElementById("logoutButton").addEventListener("click", async function (event) {
event.preventDefault(); 

try {
  const token = localStorage.getItem("token");

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

