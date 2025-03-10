import mysql from 'mysql2';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
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

// Fetch a specific task by ID
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

// Fetch all assignments
export async function fetchAssignments() {
  try {
    const [rows] = await pool.query("SELECT * FROM Assignments");
    console.log(rows);
  } catch (error) {
    console.error("Database query error:", error);
  }
}

// Create a new assignment
export async function createAssignment(title, className, dueDate, dateCreated, type, status, pointsPossible, userId) {
  try {
    const [result] = await pool.query(
      "INSERT INTO Assignments (Title, Class, DueDate, DateCreated, Type, Status, Points_Possible, UserID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [title, className, dueDate, dateCreated, type, status, pointsPossible, userId]
    );
    console.log("Assignment created with ID:", result.insertId);
  } catch (error) {
    console.error("Database query error:", error);
  }
}

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

