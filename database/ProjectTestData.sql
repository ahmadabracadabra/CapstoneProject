USE Project390DB;
-- Dumping data for table `Users`
INSERT INTO `Users` (`UserID`, `Username`, `Email`, `PasswordHash`, `FirstName`, `LastName`, `PasswordSalt`, `PasswordDate`) VALUES
(1, 'dior123', 'christian.dior@example.com', SHA2(CONCAT('hashedpassword1', 'salt1'), 256), 'Christian', 'Dior', 'salt1', '2025-01-20'),
(2, 'chanel007', 'coco.chanel@example.com', SHA2(CONCAT('hashedpassword2', 'salt2'), 256), 'Coco', 'Chanel', 'salt2', '2025-01-21'),
(3, 'versace82', 'gianni.versace@example.com', SHA2(CONCAT('hashedpassword3', 'salt3'), 256), 'Gianni', 'Versace', 'salt3', '2025-01-22'),
(4, 'gaultierX', 'jeanpaul.gaultier@example.com', SHA2(CONCAT('hashedpassword4', 'salt4'), 256), 'Jean-Paul', 'Gaultier', 'salt4', '2025-01-23'),
(5, 'vuitton21', 'louis.vuitton@example.com', SHA2(CONCAT('hashedpassword5', 'salt5'), 256), 'Louis', 'Vuitton', 'salt5', '2025-01-24'),
(6, 'lagerfeld45', 'karl.lagerfeld@example.com', SHA2(CONCAT('hashedpassword6', 'salt6'), 256), 'Karl', 'Lagerfeld', 'salt6', '2025-01-25'),
(7, 'stella.mcc', 'stella.mccartney@example.com', SHA2(CONCAT('hashedpassword7', 'salt7'), 256), 'Stella', 'McCartney', 'salt7', '2025-01-26'),
(8, 'yves123', 'yves.saintlaurent@example.com', SHA2(CONCAT('hashedpassword8', 'salt8'), 256), 'Yves', 'Saint Laurent', 'salt8', '2025-01-27'),
(9, 'calvin.k', 'calvin.klein@example.com', SHA2(CONCAT('hashedpassword9', 'salt9'), 256), 'Calvin', 'Klein', 'salt9', '2025-01-28'),
(10, 'balenciaga001', 'cristobal.balenciaga@example.com', SHA2(CONCAT('hashedpassword10', 'salt10'), 256), 'Cristobal', 'Balenciaga', 'salt10', '2025-01-29');


-- Dumping data for table `Assignments`
INSERT INTO `Assignments` (`AssignmentID`, `Title`, `Class`, `DueDate`, `DateCreated`, `Type`, `Status`, `Points_Possible`, `UserID`) VALUES
(1, 'Introduction to Sociology', 'Sociology 101', '2025-02-10', '2025-01-20', 'Research Paper', 'In Progress', 100, 1),
(2, 'Theories of Psychology', 'Psychology 201', '2025-02-15', '2025-01-21', 'Essay', 'Unstarted', 50, 2),
(3, 'World History Analysis', 'History 102', '2025-02-17', '2025-01-22', 'Group Project', 'Unstarted', 80, 3),
(4, 'Principles of Marketing', 'Marketing 101', '2025-02-18', '2025-01-23', 'Presentation', 'Done', 100, 4),
(5, 'Mathematical Theories', 'Math 201', '2025-02-20', '2025-01-24', 'Quiz', 'In Progress', 20, 5),
(6, 'Computer Science Basics', 'CS 101', '2025-02-22', '2025-01-25', 'Research Paper', 'Unstarted', 100, 6),
(7, 'Global Politics and Governance', 'Political Science 103', '2025-02-25', '2025-01-26', 'Essay', 'Done', 50, 7),
(8, 'Economics of Global Trade', 'Economics 201', '2025-03-01', '2025-01-27', 'Group Project', 'In Progress', 80, 8),
(9, 'Environmental Science', 'Biology 101', '2025-03-03', '2025-01-28', 'Quiz', 'Unstarted', 20, 9),
(10, 'Philosophy of Ethics', 'Philosophy 202', '2025-03-05', '2025-01-29', 'Essay', 'Done', 100, 10);

-- Dumping data for table `Groups`
INSERT INTO `Groups` (`GroupID`, `Name`, `Subject`, `CreatorID`, `CreatedDate`) VALUES
(1, 'Social Theories Research Group', 'Sociology', 1, '2025-01-20'),
(2, 'Psychological Research Collaborators', 'Psychology', 2, '2025-01-21'),
(3, 'History Buffs Study Group', 'History', 3, '2025-01-22'),
(4, 'Marketing Strategies Team', 'Marketing', 4, '2025-01-23'),
(5, 'Mathematics Scholars', 'Mathematics', 5, '2025-01-24'),
(6, 'Tech Innovators Club', 'Computer Science', 6, '2025-01-25'),
(7, 'Global Politics Forum', 'Political Science', 7, '2025-01-26'),
(8, 'Economics Think Tank', 'Economics', 8, '2025-01-27'),
(9, 'Environmental Studies Group', 'Biology', 9, '2025-01-28'),
(10, 'Philosophy Debaters', 'Philosophy', 10, '2025-01-29');

-- Dumping data for table `Message`
INSERT INTO `Message` (`MessageID`, `Timestamp`, `SenderID`, `MessageText`, `GroupID`, `CreatedAt`) VALUES
(1, '2025-01-20 10:30:00', 1, 'Let’s start working on our paper about sociological theories. Who’s in for the research task?', 1, '2025-01-20 10:30:00'),
(2, '2025-01-21 12:45:00', 2, 'I’ll be presenting my essay on psychological theories next week. Let’s discuss the key points.', 2, '2025-01-21 12:45:00'),
(3, '2025-01-22 09:00:00', 3, 'Let’s brainstorm ideas for our world history analysis project. Any thoughts on the major themes?', 3, '2025-01-22 09:00:00'),
(4, '2025-01-23 14:00:00', 4, 'Looking forward to our class on marketing principles. Anyone up for a team presentation?', 4, '2025-01-23 14:00:00'),
(5, '2025-01-24 16:20:00', 5, 'I’ve started the math theory quiz, but could use some input on the equations. Anyone else?', 5, '2025-01-24 16:20:00'),
(6, '2025-01-25 17:50:00', 6, 'I’ll upload my research on computer science basics soon. Who’s ready to review the paper?', 6, '2025-01-25 17:50:00'),
(7, '2025-01-26 11:00:00', 7, 'Let’s get ready for the discussion on global politics. What’s our plan for the presentation?', 7, '2025-01-26 11:00:00'),
(8, '2025-01-27 13:30:00', 8, 'We need to finalize the economics group project soon. Let’s meet tomorrow to go over the details.', 8, '2025-01-27 13:30:00'),
(9, '2025-01-28 15:10:00', 9, 'Environmental science quiz is coming up. Can we meet for a last-minute review session?', 9, '2025-01-28 15:10:00'),
(10, '2025-01-29 09:20:00', 10, 'I’ll finalize my ethics essay today. Let’s discuss it tomorrow in the forum.', 10, '2025-01-29 09:20:00');
