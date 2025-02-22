/*
To run the server, type "npm run dev" in the terminal
if you dont have the packages to do this, type "npm install"
and it should install all the packages
*/
import express from 'express';
import cors from 'cors';
import path from 'path';
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
    fetchUserByEmail 
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
    'https://websitename.com'  // AWS Link
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
    allowedHeaders: ['Content-Type'],
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

app.post('/users', async (req, res) => {
    try {
        const { username, email, passwordHash, firstName, lastName, passwordSalt, passwordDate } = req.body;
        const newUser = await createUser(username, email, passwordHash, firstName, lastName, passwordSalt, passwordDate);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: "Failed to create user" });
    }
});

// Routes for Assignments
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
