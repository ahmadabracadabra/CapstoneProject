-- Select all data from the `Users` table
SELECT * FROM `Users`;

-- Select specific columns from the `Users` table
SELECT `UserID`, `Username`, `Email` FROM `Users`;

-- Select all data from the `Assignments` table
SELECT * FROM `Assignments`;

-- Select specific columns from the `Assignments` table
SELECT `AssignmentID`, `Title`, `DueDate`, `Status` FROM `Assignments`;

-- Select all data from the `Groups` table
SELECT * FROM `Groups`;

-- Select specific columns from the `Groups` table
SELECT `GroupID`, `Name`, `Subject` FROM `Groups`;

-- Select all data from the `Message` table
SELECT * FROM `Message`;

-- Select specific columns from the `Message` table
SELECT `MessageID`, `Timestamp`, `MessageText` FROM `Message`;

-- Select all messages for a specific group (`GroupID = 1`)
SELECT * FROM `Message` WHERE `GroupID` = 1;

-- Select all assignments for a specific user (`UserID = 1`)
SELECT * FROM `Assignments` WHERE `UserID` = 1;

-- Select all users who have a specific assignment status (`Status = 'In Progress'`)
SELECT `Username`, `Email` FROM `Users`
JOIN `Assignments` ON `Users`.`UserID` = `Assignments`.`UserID`
WHERE `Assignments`.`Status` = 'In Progress';

-- Count the number of users
SELECT COUNT(*) FROM `Users`;

-- Count the number of assignments with a particular status (`'In Progress'`)
SELECT COUNT(*) FROM `Assignments` WHERE `Status` = 'In Progress';

-- Find the groups created by a specific user (`UserID = 1`)
SELECT `GroupID`, `Name` FROM `Groups` WHERE `CreatorID` = 1;

-- Select messages that contain a specific keyword (`'research'`)
SELECT `MessageText` FROM `Message` WHERE `MessageText` LIKE '%research%';

