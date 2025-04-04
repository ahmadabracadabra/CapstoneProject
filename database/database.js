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


// Fetch assignments
export async function fetchAssignments(userId) {
  try {
    const [rows] = await pool.query("SELECT * FROM Assignments WHERE UserID = ?", [userId]);
    return rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error; 
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


// MESSAGES (Updated but not finished)
export async function sendMessage(senderId, chatId, content) {
  try {
      const [result] = await pool.query(
          "INSERT INTO Messages (SenderID, ChatID, Content) VALUES (?, ?, ?)",
          [senderId, chatId, content]
      );
      return result.insertId;
  } catch (error) {
      console.error("Database query error:", error);
      throw error;
  }
}

export async function getMessagesByChat(chatId) {
  try {
      const [rows] = await pool.query(
          "SELECT * FROM Messages WHERE ChatID = ? ORDER BY SentAt ASC",
          [chatId]
      );
      return rows;
  } catch (error) {
      console.error("Database query error:", error);
      throw error;
  }
}

export async function deleteMessage(messageId, userId) {
  try {
      const [result] = await pool.query(
          "DELETE FROM Messages WHERE MessageID = ? AND SenderID = ?",
          [messageId, userId]
      );
      return result;
  } catch (error) {
      console.error("Database query error:", error);
      throw error;
  }
}

// CHAT GROUPS (Updated but not finished)
export async function createChatGroup(groupName, ownerId) {
  try {
      const [result] = await pool.query(
          "INSERT INTO ChatGroups (GroupName, OwnerID) VALUES (?, ?)",
          [groupName, ownerId]
      );
      return result.insertId;
  } catch (error) {
      console.error("Database query error:", error);
      throw error;
  }
}

export async function getChatGroupById(groupId) {
  try {
      const [rows] = await pool.query(
          "SELECT * FROM ChatGroups WHERE GroupID = ?",
          [groupId]
      );
      return rows[0];
  } catch (error) {
      console.error("Database query error:", error);
      throw error;
  }
}

export async function deleteChatGroup(groupId) {
  try {
      const [result] = await pool.query(
          "DELETE FROM ChatGroups WHERE GroupID = ?",
          [groupId]
      );
      return result;
  } catch (error) {
      console.error("Database query error:", error);
      throw error;
  }
}

// GROUP CONVERSATIONS (Updated but not finished)
export async function addUserToGroup(groupId, userId) {
  try {
      const [result] = await pool.query(
          "INSERT INTO GroupConversations (GroupID, UserID) VALUES (?, ?)",
          [groupId, userId]
      );
      return result.insertId;
  } catch (error) {
      console.error("Database query error:", error);
      throw error;
  }
}

export async function removeUserFromGroup(groupId, userId) {
  try {
      const [result] = await pool.query(
          "DELETE FROM GroupConversations WHERE GroupID = ? AND UserID = ?",
          [groupId, userId]
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

    return { message: "Friend removed successfully." };
  } catch (error) {
    console.error("Database query error:", error);
    return { message: "Error removing friend." };
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

//OUTDATED VVVV

// Fetch all groups
export async function fetchGroups() {
  try {
    const [rows] = await pool.query("SELECT * FROM Groups");
    console.log(rows);
  } catch (error) {
    console.error("Database query error:", error);
  }
}

// Create a new group
export async function createGroup(name, subject, creatorId, createdDate) {
  try {
    const [result] = await pool.query(
      "INSERT INTO Groups (Name, Subject, CreatorID, CreatedDate) VALUES (?, ?, ?, ?)",
      [name, subject, creatorId, createdDate]
    );
    console.log("Group created with ID:", result.insertId);
  } catch (error) {
    console.error("Database query error:", error);
  }
}

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

// Fetch all group members
export async function fetchGroupMembers() {
  try {
    const [rows] = await pool.query("SELECT * FROM GroupMember");
    console.log(rows);
  } catch (error) {
    console.error("Database query error:", error);
  }
}

// Add a member to a group
export async function addGroupMember(userId, groupId, joinDate, leftDate) {
  try {
    const [result] = await pool.query(
      "INSERT INTO GroupMember (UserID, GroupID, JoinDate, LeftDate) VALUES (?, ?, ?, ?)",
      [userId, groupId, joinDate, leftDate]
    );
    console.log("Group member added with UserID:", userId, "and GroupID:", groupId);
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

