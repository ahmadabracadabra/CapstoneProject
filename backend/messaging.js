const toggleBtn = document.getElementById('toggle-group-chat');
const form = document.getElementById('group-chat-form');

toggleBtn.addEventListener('click', () => {
  if (form.classList.contains('hidden')) {
    const rect = toggleBtn.getBoundingClientRect();
    const formWidth = form.offsetWidth;
    const formHeight = form.scrollHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let top = rect.top + window.scrollY;
    let left = rect.right + 10;

    if (left + formWidth > windowWidth) {
      left = windowWidth - formWidth - 10; 
    }

    if (top + formHeight > windowHeight) {
      top = windowHeight - formHeight - 10; 
    }

    if (top < 0) {
      top = 10; 
    }
    form.style.top = `${top}px`;
    form.style.left = `${left}px`;
    form.style.transform = 'translateY(0)'; 

    form.classList.remove('hidden');
  } else {
    form.classList.add('hidden');
  }
});

window.addEventListener('resize', () => {
  if (!form.classList.contains('hidden')) {
    const rect = toggleBtn.getBoundingClientRect();
    const formWidth = form.offsetWidth;
    const formHeight = form.scrollHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let top = rect.top + window.scrollY;
    let left = rect.right + 10;
    if (left + formWidth > windowWidth) {
      left = windowWidth - formWidth - 10;
    }
    if (top + formHeight > windowHeight) {
      top = windowHeight - formHeight - 10;
    }
    if (top < 0) {
      top = 10;
    }

    form.style.top = `${top}px`;
    form.style.left = `${left}px`;
  }
});

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

    if (user && user.userid) {
      localStorage.setItem('userID', user.userid);
    } else {
      console.error('User ID is missing from the response', user);
    }

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
        localStorage.removeItem("userID");  
        sessionStorage.removeItem("token");

        window.location.href = "login.html"; 
      } else {
        console.error("Logout failed:", await response.json());
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  });

  //FRIENDS
  async function fetchFriendRequests() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';  
    return;
  }

  try {
    console.log("Fetching friend requests...");
    const response = await fetch('http://localhost:8080/friend-requests', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) throw new Error('Failed to fetch friend requests');
    
    const requests = await response.json();

    const friendRequestsContainer = document.querySelector('.friend-requests-container');
    const friendRequestsList = document.getElementById('friend-requests-list');
    
    if (!friendRequestsList) {
      console.error("Friend requests list element not found");
      return;
    }

    friendRequestsList.innerHTML = '';
    
    if (requests.length === 0) {
      friendRequestsList.innerHTML = '<li class="text-gray-500 dark:text-gray-400 text-sm">No friend requests at the moment.</li>';
      friendRequestsContainer.style.display = 'none'; // Hide section
    } else {
      // If friend requests, display them 
      friendRequestsContainer.style.display = 'block';
      
      requests.forEach(request => {
        const listItem = document.createElement('li');
        listItem.classList.add('flex', 'justify-between', 'items-center', 'bg-[#101828]', 'w-full', 'py-2', 'px-3', 'mb-2'); // Reduced bottom padding

        listItem.innerHTML = `
          <span class="font-semibold text-white w-auto">${request.senderUsername}</span> <!-- Requester's name -->
          <div class="flex space-x-2"> <!-- Button container aligned to the right -->
            <button class="accept-btn text-2xl text-green-500 hover:text-green-600 cursor-pointer" data-id="${request.requestID}">
              <i class="fas fa-check"></i> <!-- Font Awesome checkmark -->
            </button>
            <button class="decline-btn text-2xl text-red-500 hover:text-red-600 cursor-pointer" data-id="${request.requestID}">
              <i class="fas fa-times"></i> <!-- Font Awesome X -->
            </button>
          </div>
        `;

        friendRequestsList.appendChild(listItem);

        listItem.querySelector('.accept-btn').addEventListener('click', async () => {
          await handleAcceptRequest(request.requestID, request.creatorID);
        });

        listItem.querySelector('.decline-btn').addEventListener('click', async () => {
          await handleDeclineRequest(request.requestID, request.creatorID);
          fetchFriendRequests();
        });
      });
    }
  } catch (error) {
    console.error('Error fetching friend requests:', error);
  }
}

async function handleAcceptRequest(requestId, creatorID) {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';  
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/friend-request/accept', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ creatorID })
    });

    const result = await response.json();

    if (response.ok) {
      alert('Friend request accepted');
      await fetchFriendRequests();
      await fetchFriendsList();
 
    } else {
      console.error(result.message || 'Error accepting friend request');
    }
  } catch (error) {
    console.error('Error handling accept request:', error);
  }
}

async function handleDeclineRequest(requestId, creatorID) {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';  
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/friend-request/decline', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ creatorID })
    });

    const result = await response.json();

    if (response.ok) {
      alert('Friend request declined');
      await fetchFriendRequests();
      await fetchFriendsList();
   
    } else {
      console.error(result.message || 'Error declining friend request');
    }
  } catch (error) {
    console.error('Error handling decline request:', error);
  }
}

async function fetchFriendsList() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';  
    return;
  }

  try {
    console.log("Fetching friends list...");
    const response = await fetch('http://localhost:8080/friends-list', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) throw new Error('Failed to fetch friends list');
    
    const friends = await response.json();

    const friendList = document.getElementById('friend-list');
    if (!friendList) {
      console.error("Friend list element not found");
      return;
    }
    
    friendList.innerHTML = ''; 
    
    if (friends.length === 0) {
      friendList.innerHTML = '<li class="text-gray-500 dark:text-gray-400 text-sm">You have no friends yet.</li>';
    } else {
      friends.forEach(friend => {
        const listItem = document.createElement('li');
        listItem.classList.add('p-2', 'bg-gray-200', 'rounded', 'flex', 'justify-between', 'items-center');
        listItem.innerHTML = `
          <div class="flex items-center justify-between w-full">
            <span class="truncate max-w-[120px] text-gray-700">${friend.username}</span>
            <div class="flex items-center space-x-2 ml-4 shrink-0">
              <button class="open-chat-btn text-blue-500 hover:text-blue-700" data-id="${friend.friendID}">
                <i class="fas fa-comment-alt"></i>
              </button>
              <button class="remove-friend-btn text-red-500 hover:text-red-700" data-id="${friend.friendID}">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        `;
        friendList.appendChild(listItem);

        listItem.querySelector('.remove-friend-btn').addEventListener('click', async () => {
          const confirmation = window.confirm(`Are you sure you want to remove ${friend.username} from your friends?`);
          if (confirmation) {
            await removeFriend(friend.friendID);
            listItem.remove(); 
          }
        });
        listItem.querySelector('.open-chat-btn').addEventListener('click', async () => {
          openChat(friend);
        });
      });
    }
  } catch (error) {
    console.error('Error fetching friends list:', error);
  }
}

//CONVERSATIONS
function openChat(friend) {
  const chatHeader = document.getElementById('chat-header');
  const chatFriendName = document.getElementById('chat-friend-name');
  const chatAvatar = document.getElementById('chat-avatar');
  const memberList = document.getElementById('chat-members');
  memberList.textContent = ''; 
  chatFriendName.textContent = friend.username;
  chatAvatar.src = friend.profilePicUrl || 'Images/minion-icon.jpg';
  chatHeader.classList.remove('hidden');
  localStorage.setItem('currentChatID', friend.friendID);
  localStorage.removeItem('currentGroupID'); 
  loadChatHistory(friend.friendID);
}


async function loadChatHistory(friendID) {
  try {
    const token = localStorage.getItem('token'); 
    const response = await fetch(`http://localhost:8080/messages/${friendID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    const messages = await response.json();
    
    // Debugging by checking message array
    const chatMessages = messages[0]; 
    console.log(chatMessages); 

    displayMessages(chatMessages); 
  } catch (error) {
    console.error(error);
    alert('Error loading messages');
  }
}

function displayMessages(messages) {
  const messagesContainer = document.getElementById('messages');
  messagesContainer.innerHTML = '';

  if (!Array.isArray(messages) || messages.length === 0) {
    messagesContainer.innerHTML = '<p style="color: white; text-align: center; font-size: 24px;">No messages found</p>';
    return;
  }

  let lastMessageDate = null;
  const currentChatID = localStorage.getItem('currentChatID'); // ID of the other person

  messages.forEach((message) => {
    if (!message || !message.created_at || !message.content) {
      console.error('Invalid message data', message);
      return;
    }

    const messageElement = document.createElement('div');

    // Format time and date
    const messageTime = new Date(message.created_at);
    const formattedTime = messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = messageTime.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Show date if different from last message
    if (lastMessageDate !== formattedDate) {
      const dateElement = document.createElement('div');
      dateElement.innerHTML = `
        <div style="text-align: center; margin: 10px 0; font-weight: bold; color: #888;">
          ${formattedDate}
        </div>
      `;
      messagesContainer.appendChild(dateElement);
      lastMessageDate = formattedDate;
    }

    const isSender = message.senderID !== parseInt(currentChatID);

    messageElement.innerHTML = `
      <div style="display: flex; flex-direction: ${isSender ? 'row-reverse' : 'row'}; margin-bottom: 10px; align-items: flex-end;">
        <!-- Sender's Name (hidden for one-on-one chats) -->
        <div style="display: none; font-weight: bold; margin-${isSender ? 'left' : 'right'}: 10px; font-size: 0.9rem; color: ${isSender ? '#ffffff' : '#555'};">
          ${message.senderName || 'Unknown Sender'}
        </div>

        <!-- Message Bubble -->
        <div style="
          background-color: ${isSender ? '#007bff' : '#e5e5e5'};
          color: ${isSender ? 'white' : 'black'};
          padding: 10px;
          border-radius: 15px;
          max-width: 75%;
          word-wrap: break-word;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        ">
          <p style="margin-top: 0.5rem; margin-bottom: 10px;">${message.content}</p>

          <div style="font-size: 0.8rem; color: ${isSender ? '#ffffff' : '#888'}; text-align: right; margin-top: auto;">
            ${formattedTime}
          </div>
        </div>
      </div>
    `;

    messagesContainer.appendChild(messageElement);
  });

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Send a message to the friend
async function sendMessage(receiverID, content) {
  try {
    const token = localStorage.getItem('token');

    const messagePayload = {
      receiverID: receiverID,
      content: content,
    };

    const response = await fetch('http://localhost:8080/message/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messagePayload),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const data = await response.json();
    alert(data.message); 

    const currentFriendID = localStorage.getItem('currentChatID');
    loadChatHistory(currentFriendID); 
  } catch (error) {
    console.error(error);
    alert('Error sending message');
  }
}


const sendButton = document.getElementById('send-message');
sendButton.addEventListener('click', () => {
  const messageInput = document.getElementById('message-input');
  const content = messageInput.value.trim();

  const currentGroupID = localStorage.getItem('currentGroupID');
  const currentChatID = localStorage.getItem('currentChatID');

  if (content) {
    if (currentGroupID) {
      sendGroupMessage(currentGroupID, content);  // Group chat message
    } else if (currentChatID) {
      sendMessage(currentChatID, content);  // One-on-one chat message
    } else {
      alert('No active chat found!');
    }

    messageInput.value = ''; 
  } else {
    alert('Please enter a message');
  }
});


async function removeFriend(friendID) {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';  
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/friend/remove', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ friendID }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log(data.message);
    } else {
      console.error(data.message);
    }
  } catch (error) {
    console.error('Error removing friend:', error);
  }
}


async function searchForFriends() {
  const searchTerm = document.getElementById('search-friends').value.trim();
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/login';  
    return;
  }

  try {
    if (searchTerm.length > 0) {
      const response = await fetch(`http://localhost:8080/friends-search?q=${encodeURIComponent(searchTerm)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) throw new Error('Failed to search for friends');

      const users = await response.json();
      displaySearchResults(users);
    } else {
      document.getElementById('search-results').innerHTML = '';
    }
  } catch (error) {
    console.error('Error searching for friends:', error);
  }
}

function displaySearchResults(users) {
  const resultsContainer = document.getElementById('search-results');
  resultsContainer.innerHTML = ''; 

  resultsContainer.classList.add('absolute', 'top-[60px]', 'left-0', 'z-10', 'bg-white', 'dark:bg-gray-900', 'shadow-lg', 'rounded-lg', 'w-full');
  if (users.length === 0) {
    resultsContainer.innerHTML = '<li class="text-gray-500 dark:text-gray-400 text-sm">No users found.</li>';
  } else {
    users.slice(0, 5).forEach(user => { 
      const listItem = document.createElement('li');
      listItem.classList.add('p-2', 'bg-[#101828]', 'text-white', 'rounded', 'flex', 'justify-between', 'items-center', 'mb-4', 'max-w-[250px]');
      listItem.innerHTML = `
        <span class="font-semibold truncate">${user.username}</span>  <!-- Truncate long names -->
        <button class="add-btn bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" data-id="${user.UserID}">
          Add
        </button>
      `;

      resultsContainer.appendChild(listItem);

      listItem.querySelector('.add-btn').addEventListener('click', async function() {
        console.log("Attempting to send friend request to UserID:", user.UserID);
        if (!user.UserID) {
          console.error("Error: UserID is undefined or null.");
          return;
        }
        await sendFriendRequest(user.UserID);
      });
    });

    if (users.length >= 5) {
      resultsContainer.classList.add('overflow-y-auto', 'max-h-[300px]');
    }
  }
}

async function sendFriendRequest(userId) {
  if (!userId) {
    console.error("sendFriendRequest error: userId is missing or null.");
    return;
  }

  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/login';
    return;
  }

  console.log("Sending request with receiverID:", userId); // Debugging

  try {
    const response = await fetch(`http://localhost:8080/friend-request/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ receiverID: userId })
    });

    if (!response.ok) throw new Error('Failed to send friend request');

    alert('Friend request sent successfully!');  
    fetchFriendRequests(); 
  } catch (error) {
    console.error('Error sending friend request:', error);
  }
}


document.getElementById('search-friends').addEventListener('input', searchForFriends);


// GROUPCHAT STUFF
async function fetchFriendsForSelection() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';  
    return;
  }

  try {
    console.log("Fetching friends list for selection...");
    const response = await fetch('http://localhost:8080/friends-list', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) throw new Error('Failed to fetch friends list for selection');
    
    const friends = await response.json();

    const friendListContainer = document.getElementById('friend-list-container');
    if (!friendListContainer) {
      console.error("Friend list container not found");
      return;
    }

    friendListContainer.style.display = 'none';

    friendListContainer.innerHTML = '';

    if (friends.length === 0) {
      friendListContainer.innerHTML = '<p class="text-gray-500">You have no friends to invite.</p>';
    } else {
      friends.forEach(friend => {
        const friendItem = document.createElement('div');
        friendItem.classList.add('friend-item', 'mb-2', 'flex', 'items-center');
        friendItem.innerHTML = `
          <label class="flex items-center bg-[#101828] text-white rounded-full p-2 mr-2">
            <input type="checkbox" id="friend-${friend.friendID}" class="friend-checkbox mr-2" data-id="${friend.friendID}">
            <span class="font-semibold truncate">${friend.username}</span>
          </label>
        `;
        friendListContainer.appendChild(friendItem);
      });
    }
  } catch (error) {
    console.error('Error fetching friends list for selection:', error);
  }
}

document.getElementById('friend-list-container').addEventListener('change', (e) => {
  if (e.target && e.target.classList.contains('friend-checkbox')) {
    const friendID = e.target.getAttribute('data-id');
    const friendName = e.target.nextElementSibling.textContent.trim(); 
    handleFriendSelection(friendID, friendName, e.target.checked);
  }
});


function handleFriendSelection(friendID, friendName, isChecked) {
  const invitedFriendsList = document.getElementById('invited-friends-list');
  const selectedFriends = Array.from(invitedFriendsList.children).map(item => item.dataset.id);
  
  if (isChecked && !selectedFriends.includes(friendID)) {
    const listItem = document.createElement('li');
    listItem.classList.add('flex', 'items-center', 'mb-2');
    listItem.dataset.id = friendID;
    listItem.innerHTML = `
      <span class="text-white">${friendName}</span>
      <button class="remove-btn text-red-500 ml-2" onclick="removeInvitedFriend(this, ${friendID})">X</button>
    `;
    invitedFriendsList.appendChild(listItem);
  } else if (!isChecked) {
    const listItem = document.querySelector(`#invited-friends-list li[data-id="${friendID}"]`);
    if (listItem) listItem.remove();
  }
}

// Remove friend from the invited list
function removeInvitedFriend(button, friendID) {
  const checkbox = document.querySelector(`#friend-${friendID}`);
  if (checkbox) checkbox.checked = false;
  
  button.closest('li').remove();
}

document.getElementById('friend-search').addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const friendItems = document.querySelectorAll('.friend-item');
  const friendListContainer = document.getElementById('friend-list-container');

  if (searchTerm.trim()) {
    friendListContainer.style.display = 'block';
  } else {
    friendListContainer.style.display = 'none';
  }

  friendItems.forEach(item => {
    const friendName = item.querySelector('label span').textContent.toLowerCase();
    if (friendName.includes(searchTerm)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
});


async function createGroupChat() {
  const channelName = document.getElementById('group-name').value;
  const description = document.getElementById('group-description').value;
  const selectedFriends = Array.from(document.querySelectorAll('#invited-friends-list li')).map(item => item.dataset.id);

  console.log('Selected friends:', selectedFriends); 

  if (!channelName || selectedFriends.length === 0) {
    alert('Please provide a group name and select at least one friend to invite.');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  try {
    console.log("Creating group chat...");
    const response = await fetch('http://localhost:8080/group/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channelName,
        description,
        invitedFriends: selectedFriends,  
      }),
    });

    if (!response.ok) throw new Error('Failed to create group chat');
    
    const result = await response.json();

    if (result.message === 'Group chat created successfully.') {
      alert('Group chat created successfully!');
      fetchGroupChats()
    } else {
      alert('Failed to create group chat.');
    }
  } catch (error) {
    console.error('Error creating group chat:', error);
  }
}


document.getElementById('create-group-btn').addEventListener('click', createGroupChat);

async function fetchGroupChats() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/group/list', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch group chats');
    }

    const result = await response.json();
    console.log("Fetched group chats:", result);

    const chatList = document.getElementById('group-chats-list');
    const groupChatsContainer = document.querySelector('.group-chats-container');

    if (!chatList) {
      console.error('Group chat list element not found');
      return;
    }

    chatList.innerHTML = '';

    if (!result.groups || result.groups.length === 0) {
      chatList.innerHTML = '<li class="text-gray-500 dark:text-gray-400 text-sm">No group chats found.</li>';
      groupChatsContainer.style.display = 'none'; // Hide if empty
      return;
    }

    groupChatsContainer.style.display = 'block'; // Show if there are chats

    result.groups.forEach(group => {
      const listItem = document.createElement('li');
      listItem.classList.add('flex', 'justify-between', 'items-center', 'bg-[#101828]', 'w-full', 'py-2', 'px-3', 'mb-2', 'rounded');

      listItem.innerHTML = `
        <span class="font-semibold text-white">${group.channel_name}</span>
        <div class="flex space-x-2 ml-auto">
          <button class="open-chat-btn text-xl text-blue-400 hover:text-blue-500 cursor-pointer" data-id="${group.channelID}" title="Open Chat">
            <i class="fa-solid fa-user-group"></i>
          </button>
          <button class="leave-group-btn text-xl text-red-500 hover:text-red-600 cursor-pointer" data-id="${group.channelID}" title="Leave Group">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `;

      listItem.querySelector('.open-chat-btn').addEventListener('click', () => {
        openGroupChat(group);
      });

      listItem.querySelector('.leave-group-btn').addEventListener('click', async () => {
        await leaveGroup(group.channelID);
      });

      chatList.appendChild(listItem);
    });

  } catch (error) {
    console.error('Error fetching group chats:', error);
  }
}


function openGroupChat(group) {
  const groupChatName = document.getElementById('chat-header');
  const groupName = document.getElementById('chat-friend-name');
  const chatAvatar = document.getElementById('chat-avatar');
  const memberList = document.getElementById('chat-members'); 
  groupName.textContent = group.channel_name;
  chatAvatar.src = group.avatarUrl || 'Images/yuji-cat.jpg';
  const membersArray = Array.isArray(group.members) ? group.members : [group.members];
  console.log("Group members:", membersArray);
  if (membersArray.length > 0) {
    const names = membersArray.join(', ');
    memberList.innerHTML = `<span style="color: white;">Members: ${names}</span>`;
  } else {
    memberList.textContent = ''; 
  }
  groupChatName.classList.remove('hidden');

  localStorage.setItem('currentGroupID', group.channelID);
  localStorage.removeItem('currentChatID');
  loadGroupChatHistory(group.channelID);
}


async function loadGroupChatHistory(groupID) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/group/messages/${groupID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch group messages');
    }

    const messages = await response.json();
    displayGroupMessages(messages);  
  } catch (error) {
    console.error(error);
    alert('Error loading messages');
  }
}

async function leaveGroup(channelID) {  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/group/leave`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ channelID }),  
    });

    if (!response.ok) {
      throw new Error('Failed to leave group');
    }

    const result = await response.json();
    console.log(result.message);
    alert(result.message);
    fetchGroupChats();  
  } catch (error) {
    console.error(error);
    alert('Error leaving group');
  }
}


function displayGroupMessages(messages) {
  const messagesContainer = document.getElementById('messages');
  messagesContainer.innerHTML = '';

  if (!Array.isArray(messages) || messages.length === 0) {
    messagesContainer.innerHTML = '<p style="color: white; text-align: center; font-size: 24px;">No messages found</p>';
    return;
  }

  let lastMessageDate = null;
  let lastSenderId = null;
  let lastReceiverName = null;
  const currentUserID = parseInt(localStorage.getItem('userID')); 

  messages.reverse().forEach((message) => {
    if (!message || !message.created_at || !message.content || !message.user_id) {
      console.error('Invalid message data', message);
      return;
    }

    const messageElement = document.createElement('div');

    const messageTime = new Date(message.created_at);
    const formattedTime = messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = messageTime.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (lastMessageDate !== formattedDate) {
      const dateElement = document.createElement('div');
      dateElement.innerHTML = `
        <div style="text-align: center; margin: 10px 0; font-weight: bold; color: #888;">
          ${formattedDate}
        </div>
      `;
      messagesContainer.appendChild(dateElement);
      lastMessageDate = formattedDate;
    }

    const isSender = message.user_id === currentUserID;
    const isSameSenderAsLastMessage = message.user_id === lastSenderId;
    const isLatestMessageFromUser = !isSameSenderAsLastMessage;

    const avatarWidth = '40px';

    messageElement.innerHTML = `
      <div style="display: flex; flex-direction: ${isSender ? 'row-reverse' : 'row'}; margin-bottom: 10px; align-items: flex-end;">
        <!-- Receiver's Avatar Placeholder (Only for the latest message from the receiver) -->
        <div style="margin-${isSender ? 'left' : 'right'}: 10px; width: ${isSender ? '0px' : avatarWidth};">
          ${!isSender && isLatestMessageFromUser ? `<img src="${message.senderAvatar || 'Images/spongebob-avatar.jpeg'}" style="border-radius: 50%; width: 30px; height: 30px;">` : ''}
        </div>

        <!-- Message Content and Bubble -->
        <div style="display: flex; flex-direction: column; max-width: 75%; word-wrap: break-word; ${isSender ? 'margin-left: 0;' : 'margin-right: 0;'}">
          <!-- Receiver's Name (Only for the Receiver and not for consecutive messages from the same user) -->
          ${!isSender && message.senderName !== lastReceiverName ? `
            <div style="font-size: 0.9rem; color: white; font-weight: bold; margin-bottom: 5px; margin-left: 10px;">
              ${message.senderName}
            </div>
          ` : ''}

          <div style="
            background-color: ${isSender ? '#007bff' : '#e5e5e5'};
            color: ${isSender ? 'white' : 'black'};
            padding: 10px;
            border-radius: 15px;
            word-wrap: break-word;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
          ">
            <!-- Message Content -->
            <p style="margin: 0;">${message.content}</p>

            <!-- Time -->
            <div style="font-size: 0.75rem; color: ${isSender ? '#ddd' : '#888'}; text-align: right; margin-top: 5px; white-space: nowrap;">
              ${formattedTime}
            </div>
          </div>
        </div>
      </div>
    `;

    messagesContainer.appendChild(messageElement);
    lastSenderId = message.user_id;
    lastReceiverName = message.senderName;
  });

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}


async function sendGroupMessage(groupID, content) {
  try {
    const token = localStorage.getItem('token');

    const messagePayload = {
      channelID: groupID,  
      content: content,
    };

    const response = await fetch('http://localhost:8080/group-message/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messagePayload),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const data = await response.json();
    alert(data.message);

    loadGroupChatHistory(groupID); 
  } catch (error) {
    console.error('Error:', error);
    alert('Error sending message');
  }
}

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
  fetchFriendRequests();
  fetchFriendsList();
  fetchFriendsForSelection();
  fetchGroupChats();
  const notificationDropdown = document.getElementById('notification-dropdown');
  notificationDropdown.classList.add('hidden');
  fetchNotifications();
  getUserData();
};

