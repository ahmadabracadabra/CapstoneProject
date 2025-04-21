import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

/*
Create a .env file in the database folder and follow this format,
.env files dont push to github (i think), so you need to make your own,
also make sure you have the database and its data installed on your device.
you can access mysql through the visual studio code terminal by typing "mysql -u root -p"
then copy the code in Project390DBSchema and paste into terminal, 
do the same for ProjectTestData.
MYSQL_HOST='127.0.0.1'
MYSQL_USER='root'
MYSQL_PASSWORD='WHATEVER-YOUR-PASSWORD-IS'
MYSQL_DATABASE='Project390DB'
*/


const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise();


// Fetch all users
export async function fetchUsers() {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    console.log(rows);
  } catch (error) {
    console.error("Database query error:", error);
  }
}

export async function fetchUserByEmail(email) {
  try {
      const [rows] = await pool.query("SELECT * FROM Users WHERE Email = ?", [email]);
      if (rows.length === 0) {
          return null; // Return null if no user is found
      }
      return rows[0]; // Return the first matching user
  } catch (error) {
      console.error("Database query error:", error);
      throw new Error("Database query failed"); // Ensure caller knows an error occurred
  }
}


  export async function fetchUserById(userId) {
    try {
      const [rows] = await pool.query("SELECT * FROM users WHERE UserID = ?", [userId]);
      return rows[0];  // Return the first matching user
    } catch (error) {
      console.error("Database query error:", error);
    }
  }

  export async function fetchUserByUsername(username) {
    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE Username = ?", [username]);
        return rows[0];  // Return the first matching user
    } catch (error) {
        console.error("Database query error:", error);
        throw new Error('Failed to fetch user by username');
    }
}


// Create a new user
export async function createUser(username, email, passwordHash, firstName, lastName) {
  try {
    const [result] = await pool.query(
      "INSERT INTO users (Username, Email, PasswordHash, FirstName, LastName) VALUES (?, ?, ?, ?, ?)",
      [username, email, passwordHash, firstName, lastName]
    );
    console.log("User created with ID:", result.insertId);
  } catch (error) {
    console.error("Database query error:", error);
  }
}

export async function fetchAllContacts() {
    try {
      const [rows] = await pool.query("SELECT * FROM Contact");
      return rows;
    } catch (error) {
      console.error("Database query error:", error);
    }
  }

  export async function fetchContactById(contactId) {
    try {
      const [rows] = await pool.query("SELECT * FROM Contact WHERE id = ?", [contactId]);
      return rows[0];
    } catch (error) {
      console.error("Database query error:", error);
    }
  }
  
  export async function createContact(name, email, message) {
    try {
      const [result] = await pool.query("INSERT INTO Contact (name, email, message) VALUES (?, ?, ?)", [name, email, message]);
      return result.insertId;
    } catch (error) {
      console.error("Database query error:", error);
    }
  }
  
  export async function deleteContact(contactId) {
    try {
      const [result] = await pool.query("DELETE FROM Contact WHERE id = ?", [contactId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Database query error:", error);
    }
  }
  
  //tasks
  export async function fetchAllTasks(userId) {
    try {
        const [rows] = await pool.query("SELECT * FROM Task WHERE UserID = ?", [userId]);
        return rows;
    } catch (error) {
        console.error("Database query error:", error);
        throw error;
    }
}

// Fetch a task by ID
export async function fetchTaskById(taskId, userId) {
    try {
        const [rows] = await pool.query("SELECT * FROM Task WHERE id = ? AND UserID = ?", [taskId, userId]);
        return rows[0];
    } catch (error) {
        console.error("Database query error:", error);
        throw error;
    }
}

// Create a new task 
export async function createTask(task, userId) {
    try {
        const [result] = await pool.query("INSERT INTO Task (task, UserID) VALUES (?, ?)", [task, userId]);
        return result.insertId;
    } catch (error) {
        console.error("Database query error:", error);
        throw error;
    }
}

// Delete a task 
export async function deleteTask(taskId, userId) {
    try {
        const [result] = await pool.query("DELETE FROM Task WHERE id = ? AND UserID = ?", [taskId, userId]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Database query error:", error);
        throw error;
    }
}

//events
export async function createEvent(name, event_date, start_time, end_time, UserID) {
  try {
      const query = 'INSERT INTO Event (name, event_date, start_time, end_time, UserID) VALUES (?, ?, ?, ?, ?)';
      const [result] = await pool.query(query, [name, event_date, start_time, end_time, UserID]);
      return { id: result.insertId, name, event_date, start_time, end_time, UserID };
  } catch (error) {
      console.error("Error creating event:", error.message);
      throw new Error("Failed to create event"); 
  }
}


export async function updateEvent(id, name, event_date, start_time, end_time, UserID) {
  try {
      const query = 'UPDATE Event SET name = ?, event_date = ?, start_time = ?, end_time = ? WHERE id = ? AND UserID = ?';
      const [result] = await pool.query(query, [name, event_date, start_time, end_time, id, UserID]);
      if (result.affectedRows === 0) {
          return null;
      }
      return { id, name, event_date, start_time, end_time, UserID };
  } catch (error) {
      throw error;
  }
}


export async function deleteEvent(id, UserId) {
  try {
      const query = 'DELETE FROM Event WHERE id = ? AND UserID = ?';
      const [result] = await pool.query(query, [id, UserId]);
      return result.affectedRows > 0;
  } catch (error) {
      throw error;
  }
}

export async function fetchEvents(UserId) {
  try {
      const query = 'SELECT * FROM Event WHERE UserID = ?';
      const [events] = await pool.query(query, [UserId]); 
      return events;
  } catch (error) {
      throw error;
  }
}


export async function fetchEventById(id, UserId) {
  try {
      const query = 'SELECT * FROM Event WHERE id = ? AND UserID = ?';
      const [event] = await pool.query(query, [id, UserId]);
      return event[0];  
  } catch (error) {
      throw error;
  }
}


export async function getQuoteOfTheDay() {
  try {
      const query = 'SELECT quote FROM DailyQuote WHERE date = CURDATE() LIMIT 1';
      const [rows] = await pool.query(query);
      return rows.length ? rows[0].quote : null;
  } catch (error) {
      throw error;
  }
}

// Fetch all assignments
export async function fetchAssignments(userId) {
  try {
    const [rows] = await pool.query("SELECT * FROM Assignments WHERE UserID = ?", [userId]);
    return rows;
  } catch (error) {
    console.error("Database query error:", error);
  }
}

// Create a assignment
export async function createAssignment(title, className, dueDate, dateCreated, description, status, pointsPossible, userId) {
  try {
    const [result] = await pool.query(
      "INSERT INTO Assignments (Title, Class, DueDate, DateCreated, Description, Status, Points_Possible, UserID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [title, className, dueDate, dateCreated, description, status, pointsPossible, userId]
    );
    return { id: result.insertId, title, className, dueDate, dateCreated, description, status, pointsPossible, userId };
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

// Delete assignment
export async function deleteAssignment(assignmentId, userId) {
  try {
      const [result] = await pool.query(
          "DELETE FROM Assignments WHERE AssignmentID = ? AND UserID = ?", 
          [assignmentId, userId]
      );
      return result;
  } catch (error) {
      console.error("Database query error:", error);
      throw error; 
  }
}

export async function updateAssignmentStatus(assignmentId, userId, status) {
  const query = 'UPDATE Assignments SET Status = ? WHERE AssignmentID = ? AND UserID = ?';
  const [result] = await pool.execute(query, [status, assignmentId, userId]);
  return result;
}


//BUDGETING
// Fetch all transactions for a user
export async function fetchTransactions(userId) {
  try {
    const [rows] = await pool.query("SELECT * FROM transactions WHERE user_id = ?", [userId]);
    return rows;
  } catch (error) {
    console.error("Database query error:", error);
  }
}

// Create a transaction
export async function createTransaction(transactionDate, category, item, type, amount, userId) {
  try {
    const [result] = await pool.query(
      "INSERT INTO transactions (transaction_date, category, item, type, amount, user_id) VALUES (?, ?, ?, ?, ?, ?)",
      [transactionDate, category, item, type, amount, userId]
    );
    return {
      id: result.insertId,
      transactionDate,
      category,
      item,
      type,
      amount,
      userId
    };
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

// Delete a transaction
export async function deleteTransaction(transactionId, userId) {
  try {
    const [result] = await pool.query(
      "DELETE FROM transactions WHERE id = ? AND user_id = ?", 
      [transactionId, userId]
    );
    return result;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}


// FRIENDS
export async function sendFriendRequest(creatorID, receiverID) {
  try {
    // Check if friend request already exists or already friends
    const [existingRequest] = await pool.query(
      "SELECT * FROM friendrequests WHERE (creatorID = ? AND receiverID = ?) OR (creatorID = ? AND receiverID = ?)",
      [creatorID, receiverID, receiverID, creatorID]
    );

    if (existingRequest.length > 0) {
      // A request already exists
      return { message: "Request already exists or are already friends." };
    }

    await pool.query(
      "INSERT INTO friendrequests (creatorID, receiverID, status) VALUES (?, ?, 'pending')",
      [creatorID, receiverID]
    );

    return { message: "Friend request sent." };
  } catch (error) {
    console.error("Database query error:", error);
    return { message: "Error sending friend request." };
  }
}

export async function acceptFriendRequest(creatorID, receiverID) {
  try {
    // Check if the request exists and is pending
    const [request] = await pool.query(
      "SELECT * FROM friendrequests WHERE creatorID = ? AND receiverID = ? AND status = 'pending'",
      [creatorID, receiverID]
    );

    if (request.length === 0) {
      return { message: "No pending friend request to accept." };
    }

    // Update status to accepted
    await pool.query(
      "UPDATE friendrequests SET status = 'accepted' WHERE creatorID = ? AND receiverID = ?",
      [creatorID, receiverID]
    );

    // Add the users to the friends table for both directions
    await pool.query(
      "INSERT INTO friends (FriendID1, FriendID2, CreatedAt) VALUES (?, ?, NOW()), (?, ?, NOW())",
      [creatorID, receiverID, receiverID, creatorID]
    );

    // Fetch and return the updated friends list for the creator
    const [creatorFriends] = await pool.query(
      "SELECT * FROM friends WHERE FriendID1 = ? OR FriendID2 = ?",
      [creatorID, creatorID]
    );

    const [receiverFriends] = await pool.query(
      "SELECT * FROM friends WHERE FriendID1 = ? OR FriendID2 = ?",
      [receiverID, receiverID]
    );

    return {
      message: "Friend request accepted.",
      creatorFriends,
      receiverFriends
    };

  } catch (error) {
    console.error("Database query error:", error);
    return { message: "Error accepting friend request." };
  }
}

export async function declineFriendRequest(creatorID, receiverID) {
  try {
    // Check if the request exists and is pending
    const [request] = await pool.query(
      "SELECT * FROM friendrequests WHERE creatorID = ? AND receiverID = ? AND status = 'pending'",
      [creatorID, receiverID]
    );

    if (request.length === 0) {
      return { message: "No pending friend request to decline." };
    }

    // Delete the friend request
    await pool.query(
      "DELETE FROM friendrequests WHERE creatorID = ? AND receiverID = ?",
      [creatorID, receiverID]
    );

    // Return updated friends lists 
    const [creatorFriends] = await pool.query(
      "SELECT * FROM friends WHERE FriendID1 = ? OR FriendID2 = ?",
      [creatorID, creatorID]
    );

    const [receiverFriends] = await pool.query(
      "SELECT * FROM friends WHERE FriendID1 = ? OR FriendID2 = ?",
      [receiverID, receiverID]
    );

    return {
      message: "Friend request declined.",
      creatorFriends,
      receiverFriends
    };

  } catch (error) {
    console.error("Database query error:", error);
    return { message: "Error declining friend request." };
  }
}

// Remove a friend
export async function removeFriend(userID, friendID) {
  try {
    const result = await pool.query(
      `DELETE FROM friends
       WHERE (FriendID1 = ? AND FriendID2 = ?) OR (FriendID1 = ? AND FriendID2 = ?)`,
      [userID, friendID, friendID, userID]
    );
    
    if (result.affectedRows === 0) {
      return { message: "No friend relationship found to remove." };
    }

    await pool.query(
      `DELETE FROM friendrequests
       WHERE (CreatorID = ? AND ReceiverID = ?) OR (CreatorID = ? AND ReceiverID = ?)`,
      [userID, friendID, friendID, userID]
    );

    return { message: "Friend removed and pending requests cleared successfully." };
  } catch (error) {
    console.error("Database query error:", error);
    return { message: "Error removing friend or clearing requests." };
  }
}


// Fetch Pending Friend Requests
export async function fetchFriendRequests(userID) {
  try {
    const [requests] = await pool.query(
      `SELECT fr.requestID, fr.creatorID, fr.receiverID, fr.status, u.username AS senderUsername
       FROM friendrequests fr
       JOIN users u ON fr.creatorID = u.UserID
       WHERE fr.receiverID = ? AND fr.status = 'pending'`,
      [userID]
    );
    return requests;  
  } catch (error) {
    console.error("Database query error:", error);
    return { message: "Error fetching friend requests." };
  }
}

export async function fetchFriendsList(userID) {
  try {
    const [friends] = await pool.query(
      `SELECT u.username, 
              CASE WHEN f.FriendID1 = ? THEN f.FriendID2 ELSE f.FriendID1 END AS FriendID
       FROM friends f
       JOIN users u ON u.userid = (CASE WHEN f.FriendID1 = ? THEN f.FriendID2 ELSE f.FriendID1 END)
       WHERE f.FriendID1 = ? OR f.FriendID2 = ?
       AND (f.FriendID1 != ? AND f.FriendID2 != ?)`, 
      [userID, userID, userID, userID, userID, userID]
    );

    const formattedFriends = friends.map(friend => ({
      username: friend.username,
      friendID: friend.FriendID
    }));

    return formattedFriends;  
  } catch (error) {
    console.error("Database query error:", error);
    return { message: "Error fetching friends list." };
  }
}

export async function searchUsers(searchTerm) {
  try {
    const query = `
      SELECT UserID, username 
      FROM users 
      WHERE username LIKE ? 
      LIMIT 10;
    `;
    const [rows] = await pool.query(query, [`%${searchTerm}%`]);
    return rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

//MESSAGING 
// Fetch messages between two friends
export async function getMessages(userID, friendID) {
  try {
    const result = await pool.query(
      `SELECT m.*, u.username as senderName 
       FROM message m
       JOIN users u ON m.senderID = u.userid
       WHERE (m.senderID = ? AND m.receiverID = ?) 
          OR (m.senderID = ? AND m.receiverID = ?)
       ORDER BY m.created_at ASC`,
      [userID, friendID, friendID, userID]
    );

    if (result.length === 0) {
      return { message: "No messages found between these users." };
    }

    return result; 
  } catch (error) {
    console.error("Database query error:", error);
    return { message: "Error fetching messages." };
  }
}


// Send a message
export async function sendMessage(senderID, receiverID, content) {
  try {
      const created_at = new Date(); 
      const result = await pool.query(
          `INSERT INTO message (senderID, receiverID, content, created_at)
           VALUES (?, ?, ?, ?)`,
          [senderID, receiverID, content, created_at]
      );
      if (result.affectedRows === 0) {
          return { message: "Failed to send message." };
      }
      return { message: "Message sent successfully." };
  } catch (error) {
      console.error("Database query error:", error);
      return { message: "Error sending message." };
  }
}


// Create a notification
export async function createNotification(type, content, userID) {
  try {
    const result = await pool.query(
      `INSERT INTO Notification (type, content, UserID)
       VALUES (?, ?, ?)`,
      [type, content, userID]
    );

    if (result.affectedRows === 0) {
      return { message: "Failed to create notification." };
    }

    return { message: "Notification created successfully." };
  } catch (error) {
    console.error("Database query error:", error);
    return { message: "Error creating notification." };
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationID) {
  try {
    const result = await pool.query(
      `UPDATE Notification
       SET is_read = 1
       WHERE id = ?`,
      [notificationID]
    );

    if (result.affectedRows === 0) {
      return { message: "Notification not found or already read." };
    }

    return { message: "Notification marked as read." };
  } catch (error) {
    console.error("Database query error:", error);
    return { message: "Error marking notification as read." };
  }
}

// Get all notifications for a specific user
export async function getNotificationsByUser(userID, limit, offset) {
  try {
    const [rows] = await pool.query(
      `SELECT id, type, content, is_read, created_at 
       FROM Notification 
       WHERE UserID = ? AND is_read = 0 
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [userID, limit, offset]
    );
    
    return rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw new Error("Error retrieving notifications.");
  }
}

export async function clearAllNotifications(userID) {
  try {
    const result = await pool.query(
      `DELETE FROM Notification WHERE UserID = ?`,
      [userID]
    );

    if (result.affectedRows === 0) {
      return { message: "No notifications found to clear." };
    }

    return { message: "All notifications cleared." };
  } catch (error) {
    console.error("Database query error:", error);
    return { message: "Error clearing notifications." };
  }
}

// Create a new group chat (channel)
export async function createGroupChat(channelName, description, creatorID, invitedFriends) {
  console.log('Invited Friends:', invitedFriends);

  if (!Array.isArray(invitedFriends)) {
    console.error('invitedFriends is not an array');
    return { message: 'Error: invitedFriends is not an array.' };
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await pool.query(
      `INSERT INTO channels (channel_name, description, creator_id)
       VALUES (?, ?, ?)`,
      [channelName, description, creatorID]
    );

    const channelID = result[0].insertId;
    console.log('Channel created with ID:', channelID);

    await pool.query(
      `INSERT INTO group_membership (channel_id, user_id)
       VALUES (?, ?)`,
      [channelID, creatorID]
    );
    for (let friendID of invitedFriends) {
      await pool.query(
        `INSERT INTO group_membership (channel_id, user_id)
         VALUES (?, ?)`,
        [channelID, friendID]
      );
    }
    const membersResult = await pool.query(
      `SELECT u.username FROM users u
       JOIN group_membership gm ON u.userid = gm.user_id
       WHERE gm.channel_id = ?`,
      [channelID]
    );
    const members = membersResult.map(row => row.username);
    await connection.commit();
    return {
      message: "Group chat created successfully.",
      channelID,
      members 
    };
  } catch (error) {
    await connection.rollback();
    console.error("Database transaction error:", error);
    return { message: "Error creating group chat." };
  } finally {
    connection.release();
  }
}

export async function getUserGroupChats(userID) {
  try {
    const [rows] = await pool.query(
      `SELECT 
          c.channel_id AS channelID,
          c.channel_name,
          c.description,
          c.created_at,
          GROUP_CONCAT(u.username ORDER BY u.username ASC) AS members
        FROM group_membership gm
        JOIN channels c ON gm.channel_id = c.channel_id
        JOIN users u ON gm.user_id = u.userid
        WHERE gm.channel_id IN (
          SELECT channel_id 
          FROM group_membership 
          WHERE user_id = ?
        )
        GROUP BY c.channel_id;`,
      [userID]
    );

    return { groups: rows };
  } catch (error) {
    console.error("Database query error:", error);
    return { groups: [], message: "Error fetching user group chats." };
  }
}

export async function getGroupMessages(channelID, page = 1, limit = 20) {
  try {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query(
      `SELECT g.*, u.username AS senderName
       FROM group_message g
       JOIN users u ON g.user_id = u.UserID
       WHERE g.channel_id = ?
       ORDER BY g.created_at DESC
       LIMIT ? OFFSET ?`,
      [channelID, parseInt(limit), parseInt(offset)]
    );
    return rows;
  } catch (error) {
    console.error("Database query error:", error);
    return [];
  }
}

// Send a group message
export async function sendGroupMessage(channelID, userID, content) {
  try {
    const created_at = new Date(); 

    console.log('Executing query with parameters:', [channelID, userID, content, created_at]);

    const result = await pool.query(
      `INSERT INTO group_message (channel_id, user_id, content, created_at)
       VALUES (?, ?, ?, ?)`,
      [channelID, userID, content, created_at]
    );

    if (result.affectedRows === 0) {
      return { message: "Failed to send group message." };
    }

    return { message: "Group message sent successfully." };
  } catch (error) {
    console.error("Database query error:", error);
    return { message: "Error sending group message." };
  }
}

// Leave a group
export async function leaveGroup(channelID, userID) {
  try {
    const result = await pool.query(
      `DELETE FROM group_membership WHERE channel_id = ? AND user_id = ?`,
      [channelID, userID]
    );
    if (result.affectedRows === 0) {
      return { message: "You are not a member of this group." };
    }

    return { message: "Successfully left the group." };
  } catch (error) {
    console.error("Database query error:", error);
    return { message: "Error leaving group." };
  }
}

// Function to get group members by channel_id
export async function getGroupMembers(channelID) {
  try {
    const [rows] = await pool.query(
      `SELECT user_id FROM group_membership WHERE channel_id = ?`,
      [channelID]
    );

    if (rows.length === 0) {
      return [];
    }
    return rows.map(row => row.user_id);
  } catch (error) {
    console.error('Error fetching group members:', error);
    throw new Error('Error fetching group members');
  }
}

export async function getGroupByID(channelID) {
  try {
    const [rows] = await pool.query(
      `SELECT channel_id AS channelID, channel_name
       FROM channels
       WHERE channel_id = ?`, 
      [channelID]
    );
    return rows[0];  
  } catch (error) {
    console.error("Error fetching group by ID:", error);
    throw error;
  }
}


//OUTDATED VVVV
// Fetch all meeting messages
export async function fetchMeetingMessages() {
  try {
    const [rows] = await pool.query("SELECT * FROM MeetingMessages");
    console.log(rows);
  } catch (error) {
    console.error("Database query error:", error);
  }
}

// Create a new meeting message
export async function createMeetingMessage(meetingId, senderId, messageText, timestamp) {
  try {
    const [result] = await pool.query(
      "INSERT INTO MeetingMessages (MeetingID, SenderID, MessageText, Timestamp) VALUES (?, ?, ?, ?)",
      [meetingId, senderId, messageText, timestamp]
    );
    console.log("Meeting message created with ID:", result.insertId);
  } catch (error) {
    console.error("Database query error:", error);
  }
}

// Fetch all meetings
export async function fetchMeetings() {
  try {
    const [rows] = await pool.query("SELECT * FROM Meetings");
    console.log(rows);
  } catch (error) {
    console.error("Database query error:", error);
  }
}

// Create a new meeting
export async function createMeeting(hostId, groupId, startTime, endTime, status, meetingLink) {
  try {
    const [result] = await pool.query(
      "INSERT INTO Meetings (HostID, GroupID, StartTime, EndTime, Status, MeetingLink) VALUES (?, ?, ?, ?, ?, ?)",
      [hostId, groupId, startTime, endTime, status, meetingLink]
    );
    console.log("Meeting created with ID:", result.insertId);
  } catch (error) {
    console.error("Database query error:", error);
  }
}


// Fetch all message recipients
export async function fetchMessageRecipients() {
  try {
    const [rows] = await pool.query("SELECT * FROM MessageRecipient");
    console.log(rows);
  } catch (error) {
    console.error("Database query error:", error);
  }
}

// Add a recipient to a message
export async function addMessageRecipient(recipientId, messageId) {
  try {
    const [result] = await pool.query(
      "INSERT INTO MessageRecipient (RecipientID, MessageID) VALUES (?, ?)",
      [recipientId, messageId]
    );
    console.log("Message recipient added for MessageID:", messageId);
  } catch (error) {
    console.error("Database query error:", error);
  }
}

// Fetch all meeting recordings
export async function fetchMeetingRecordings() {
  try {
    const [rows] = await pool.query("SELECT * FROM MeetingRecordings");
    console.log(rows);
  } catch (error) {
    console.error("Database query error:", error);
  }
}

// Create a new meeting recording
export async function createMeetingRecording(meetingId, recordedBy, recordingUrl) {
  try {
    const [result] = await pool.query(
      "INSERT INTO MeetingRecordings (MeetingID, RecordedBy, RecordingURL) VALUES (?, ?, ?)",
      [meetingId, recordedBy, recordingUrl]
    );
    console.log("Meeting recording created with ID:", result.insertId);
  } catch (error) {
    console.error("Database query error:", error);
  }
}

// Fetch all meeting participants
export async function fetchMeetingParticipants() {
  try {
    const [rows] = await pool.query("SELECT * FROM MeetingParticipants");
    console.log(rows);
  } catch (error) {
    console.error("Database query error:", error);
  }
}

// Add a participant to a meeting
export async function addMeetingParticipant(meetingId, userId, joinedAt, leftAt) {
  try {
    const [result] = await pool.query(
      "INSERT INTO MeetingParticipants (MeetingID, UserID, JoinedAt, LeftAt) VALUES (?, ?, ?, ?)",
      [meetingId, userId, joinedAt, leftAt]
    );
    console.log("Meeting participant added with MeetingID:", meetingId, "and UserID:", userId);
  } catch (error) {
    console.error("Database query error:", error);
  }
}

// Profile
export async function updateSaveProfile(bio, profilePicUrl, username) {
  try {
    bio = (bio !== undefined && bio !== null) ? bio : null;
    profilePicUrl = (profilePicUrl !== undefined && profilePicUrl !== null) ? profilePicUrl : null;
    const query = `UPDATE Users SET bio = ?, profilePicUrl = ? WHERE Username = ?`;
    const [result] = await pool.execute(query, [bio, profilePicUrl, username]);
    if (result && result.affectedRows) {
      return result;
    } else {
      throw new Error('No rows were affected. Please check if the username exists.');
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;  
  }
}

export async function getUserProfile(id) {
  try {
    const query = 'SELECT bio, profilePicUrl FROM Users WHERE userid = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0] || null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;  
  }
}

