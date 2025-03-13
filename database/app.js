/*
To run the server, type "npm run dev" in the terminal
if you dont have the packages to do this, type "npm install"
and it should install all the packages
*/
import express from 'express';
import cors from 'cors';
import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { 
    fetchUsers, 
    createUser, 
    fetchAssignments, 
    createAssignment, 
    fetchGroups, 
    createGroup, 
    fetchMeetingMessages, 
    createMeetingMessage, 
    fetchMeetings, 
    createMeeting, 
    fetchGroupMembers, 
    addGroupMember, 
    fetchMessageRecipients, 
    addMessageRecipient, 
    fetchMeetingRecordings, 
    createMeetingRecording, 
    fetchMeetingParticipants, 
    addMeetingParticipant,
    fetchUserById,
    fetchUserByEmail,
    createContact,
    createTask,
    deleteTask,
    fetchAllTasks,
    fetchTaskById,
    createEvent,
    updateEvent,
    deleteEvent,
    fetchEvents,
    fetchEventById 
} from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


/* AWS will require this to be configured in order for the website to appear,
if you do inspect element on the webpage and there is a CORS error, this is what
it wants you to fill out, you just need to edit the origin.
*/
const allowedOrigins = [
    'http://127.0.0.1:5500',   // Local
    'http://35.174.153.248:8080',  // AWS Link
    'http://35.174.153.248:8080/dashboard' //Dashboard CORS (Prob not needed)
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));



app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'landingpage.html'));
});

app.use(express.json());

// Routes for Users
app.get('/users', async (req, res) => {
    try {
        const users = await fetchUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const user = await fetchUserById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

  app.post('/signup', async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await createUser(username, email, passwordHash, firstName, lastName, new Date());
        res.status(201).json({
            message: 'User created successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create user" });
    }
});


dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY  // ATTENTION!!! Store in .env with your local database info

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const user = await fetchUserByEmail(email);

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        console.log("User fetched from database:", user); // Debugging 

        const isMatch = await bcrypt.compare(password, user.PasswordHash);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.UserID, email: user.Email }, 
            SECRET_KEY, 
            { expiresIn: "1h" } // Token expiration
        );

        res.json({ message: "Login successful", token });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error" });
    }
});


  
  app.get("/login", (req, res) => {
    res.status(405).json({ error: "Use POST /login instead" });
});

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(403).json({ error: "Access denied. No token provided." });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({ error: "Invalid token." });
        }
        req.user = user; 
        next();
    });
};


app.get('/dashboard', authenticateToken, (req, res) => {
    res.json({ email: req.user.email, message: "Welcome to your dashboard!" });
});


// Get all contacts
app.get('/contact', async (req, res) => {
    try {
      const contacts = await fetchAllContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });
  
  // Get a single contact by ID
  app.get('/contact/:id', async (req, res) => {
    try {
      const contact = await fetchContactById(req.params.id);
      if (contact) {
        res.json(contact);
      } else {
        res.status(404).json({ error: "Contact not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact" });
    }
  });
  
  // Create a new contact
  app.post('/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        console.log("Received:", { name, email, message });

        if (!name || !email || !message) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const contactId = await createContact(name, email, message);
        console.log("Contact created:", contactId);

        res.status(201).json({ id: contactId, name, email, message });
    } catch (error) {
        console.error("Error in /contacts route:", error);
        res.status(500).json({ error: "Failed to create contact" });
    }
});

  
  // Delete a contact
  app.delete('/contact/:id', async (req, res) => {
    try {
      const success = await deleteContact(req.params.id);
      if (success) {
        res.json({ message: "Contact deleted successfully" });
      } else {
        res.status(404).json({ error: "Contact not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete contact" });
    }
  });
  
  // Tasks
  app.get('/tasks', authenticateToken, async (req, res) => {
    try {
        const tasks = await fetchAllTasks(req.user.id); 
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

app.get('/tasks/:id', authenticateToken, async (req, res) => {
    const taskId = req.params.id;
    try {
        const task = await fetchTaskById(taskId, req.user.id); 
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch task" });
    }
});

app.post('/tasks', authenticateToken, async (req, res) => {
    const { task } = req.body;
    if (!task) {
        return res.status(400).json({ error: "Task is required" });
    }

    try {
        const taskId = await createTask(task, req.user.id);
        res.status(201).json({ id: taskId, task });
    } catch (error) {
        res.status(500).json({ error: "Failed to create task" });
    }
});

app.delete('/tasks/:id', authenticateToken, async (req, res) => {
    const taskId = req.params.id;
    try {
        const success = await deleteTask(taskId, req.user.id); 
        if (!success) {
            return res.status(404).json({ error: "Task not found or unauthorized" });
        }
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete task" });
    }
});

//calendar 
app.post('/events', authenticateToken, async (req, res) => {
    const { name, event_date } = req.body;

    if (!name || !event_date) {
        return res.status(400).json({ error: "Name and event_date are required" });
    }

    try {
        const event = await createEvent(name, event_date, req.user.id);
        res.status(201).json({ id: event.id, name: event.name, event_date: event.event_date });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create event' });
    }
});

// Update event
app.put('/events/:id', authenticateToken, async (req, res) => {
    const { name, event_date } = req.body;

    if (!name || !event_date) {
        return res.status(400).json({ error: "Name and event_date are required" });
    }

    try {
        const updatedEvent = await updateEvent(req.params.id, name, event_date, req.user.id);
        if (!updatedEvent) {
            return res.status(404).json({ error: 'No event found or you do not have permission to update this event' });
        }
        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update event' });
    }
});

app.delete('/events/:id', authenticateToken, async (req, res) => {
    try {
        const success = await deleteEvent(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'No event found' });
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

// Get all events
app.get('/events', authenticateToken, async (req, res) => {
    try {
        const events = await fetchEvents();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Get event by ID
app.get('/events/:id', authenticateToken, async (req, res) => {
    try {
        const event = await fetchEventById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch event' });
    }
});

//Assignments
app.get('/assignments', async (req, res) => {
    try {
        const assignments = await fetchAssignments();
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch assignments" });
    }
});

app.post('/assignments', async (req, res) => {
    try {
        const { title, className, dueDate, dateCreated, type, status, pointsPossible, userId } = req.body;
        const newAssignment = await createAssignment(title, className, dueDate, dateCreated, type, status, pointsPossible, userId);
        res.status(201).json(newAssignment);
    } catch (error) {
        res.status(500).json({ error: "Failed to create assignment" });
    }
});

// Routes for Groups
app.get('/groups', async (req, res) => {
    try {
        const groups = await fetchGroups();
        res.json(groups);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch groups" });
    }
});

app.post('/groups', async (req, res) => {
    try {
        const { name, subject, creatorId, createdDate } = req.body;
        const newGroup = await createGroup(name, subject, creatorId, createdDate);
        res.status(201).json(newGroup);
    } catch (error) {
        res.status(500).json({ error: "Failed to create group" });
    }
});

// Routes for Meeting Messages
app.get('/meeting-messages', async (req, res) => {
    try {
        const messages = await fetchMeetingMessages();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch meeting messages" });
    }
});

app.post('/meeting-messages', async (req, res) => {
    try {
        const { meetingId, senderId, messageText, timestamp } = req.body;
        const newMessage = await createMeetingMessage(meetingId, senderId, messageText, timestamp);
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: "Failed to create meeting message" });
    }
});

// Routes for Meetings
app.get('/meetings', async (req, res) => {
    try {
        const meetings = await fetchMeetings();
        res.json(meetings);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch meetings" });
    }
});

app.post('/meetings', async (req, res) => {
    try {
        const { hostId, groupId, startTime, endTime, status, meetingLink } = req.body;
        const newMeeting = await createMeeting(hostId, groupId, startTime, endTime, status, meetingLink);
        res.status(201).json(newMeeting);
    } catch (error) {
        res.status(500).json({ error: "Failed to create meeting" });
    }
});

// Routes for Group Members
app.get('/group-members', async (req, res) => {
    try {
        const members = await fetchGroupMembers();
        res.json(members);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch group members" });
    }
});

app.post('/group-members', async (req, res) => {
    try {
        const { userId, groupId, joinDate, leftDate } = req.body;
        const newMember = await addGroupMember(userId, groupId, joinDate, leftDate);
        res.status(201).json(newMember);
    } catch (error) {
        res.status(500).json({ error: "Failed to add group member" });
    }
});

// Routes for Message Recipients
app.get('/message-recipients', async (req, res) => {
    try {
        const recipients = await fetchMessageRecipients();
        res.json(recipients);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch message recipients" });
    }
});

app.post('/message-recipients', async (req, res) => {
    try {
        const { recipientId, messageId } = req.body;
        const newRecipient = await addMessageRecipient(recipientId, messageId);
        res.status(201).json(newRecipient);
    } catch (error) {
        res.status(500).json({ error: "Failed to add message recipient" });
    }
});

// Routes for Meeting Recordings
app.get('/meeting-recordings', async (req, res) => {
    try {
        const recordings = await fetchMeetingRecordings();
        res.json(recordings);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch meeting recordings" });
    }
});

app.post('/meeting-recordings', async (req, res) => {
    try {
        const { meetingId, recordedBy, recordingUrl } = req.body;
        const newRecording = await createMeetingRecording(meetingId, recordedBy, recordingUrl);
        res.status(201).json(newRecording);
    } catch (error) {
        res.status(500).json({ error: "Failed to create meeting recording" });
    }
});

// Routes for Meeting Participants
app.get('/meeting-participants', async (req, res) => {
    try {
        const participants = await fetchMeetingParticipants();
        res.json(participants);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch meeting participants" });
    }
});

app.post('/meeting-participants', async (req, res) => {
    try {
        const { meetingId, userId, joinedAt, leftAt } = req.body;
        const newParticipant = await addMeetingParticipant(meetingId, userId, joinedAt, leftAt);
        res.status(201).json(newParticipant);
    } catch (error) {
        res.status(500).json({ error: "Failed to add meeting participant" });
    }
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
