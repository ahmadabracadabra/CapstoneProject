-- MySQL dump 10.13  Distrib 9.2.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: project390db
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Assignments`
--

DROP TABLE IF EXISTS `Assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Assignments` (
  `AssignmentID` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(255) NOT NULL,
  `Class` varchar(100) NOT NULL,
  `DueDate` date NOT NULL,
  `DateCreated` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Type` varchar(100) NOT NULL,
  `Status` enum('Unstarted','In Progress','Done') NOT NULL,
  `Points_Possible` int NOT NULL,
  `UserID` int NOT NULL,
  PRIMARY KEY (`AssignmentID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Contact`
--

DROP TABLE IF EXISTS `Contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Contact` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `DailyQuote`
--

DROP TABLE IF EXISTS `DailyQuote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DailyQuote` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quote` text NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Event`
--

DROP TABLE IF EXISTS `Event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Event` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `event_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UserID` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_event_user` (`UserID`),
  CONSTRAINT `fk_event_user` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `GroupMember`
--

DROP TABLE IF EXISTS `GroupMember`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GroupMember` (
  `JoinDate` date NOT NULL,
  `LeftDate` date DEFAULT NULL,
  `UserID` int NOT NULL,
  `GroupID` int NOT NULL,
  PRIMARY KEY (`UserID`,`GroupID`),
  KEY `GroupID` (`GroupID`),
  CONSTRAINT `groupmember_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `groupmember_ibfk_2` FOREIGN KEY (`GroupID`) REFERENCES `Groups` (`GroupID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Groups`
--

DROP TABLE IF EXISTS `Groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Groups` (
  `GroupID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Subject` varchar(100) NOT NULL,
  `CreatorID` int NOT NULL,
  `CreatedDate` date NOT NULL,
  PRIMARY KEY (`GroupID`),
  KEY `CreatorID` (`CreatorID`),
  CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`CreatorID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `MeetingMessages`
--

DROP TABLE IF EXISTS `MeetingMessages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MeetingMessages` (
  `MessageID` int NOT NULL AUTO_INCREMENT,
  `MeetingID` int NOT NULL,
  `SenderID` int NOT NULL,
  `MessageText` text NOT NULL,
  `Timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`MessageID`),
  KEY `MeetingID` (`MeetingID`),
  KEY `SenderID` (`SenderID`),
  CONSTRAINT `meetingmessages_ibfk_1` FOREIGN KEY (`MeetingID`) REFERENCES `Meetings` (`MeetingID`) ON DELETE CASCADE,
  CONSTRAINT `meetingmessages_ibfk_2` FOREIGN KEY (`SenderID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `MeetingParticipants`
--

DROP TABLE IF EXISTS `MeetingParticipants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MeetingParticipants` (
  `MeetingID` int NOT NULL,
  `UserID` int NOT NULL,
  `JoinedAt` datetime DEFAULT NULL,
  `LeftAt` datetime DEFAULT NULL,
  PRIMARY KEY (`MeetingID`,`UserID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `meetingparticipants_ibfk_1` FOREIGN KEY (`MeetingID`) REFERENCES `Meetings` (`MeetingID`) ON DELETE CASCADE,
  CONSTRAINT `meetingparticipants_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `MeetingRecordings`
--

DROP TABLE IF EXISTS `MeetingRecordings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MeetingRecordings` (
  `RecordingID` int NOT NULL AUTO_INCREMENT,
  `MeetingID` int NOT NULL,
  `RecordedBy` int NOT NULL,
  `RecordingURL` varchar(255) NOT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`RecordingID`),
  KEY `MeetingID` (`MeetingID`),
  KEY `RecordedBy` (`RecordedBy`),
  CONSTRAINT `meetingrecordings_ibfk_1` FOREIGN KEY (`MeetingID`) REFERENCES `Meetings` (`MeetingID`) ON DELETE CASCADE,
  CONSTRAINT `meetingrecordings_ibfk_2` FOREIGN KEY (`RecordedBy`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Meetings`
--

DROP TABLE IF EXISTS `Meetings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Meetings` (
  `MeetingID` int NOT NULL AUTO_INCREMENT,
  `HostID` int NOT NULL,
  `GroupID` int DEFAULT NULL,
  `StartTime` datetime DEFAULT CURRENT_TIMESTAMP,
  `EndTime` datetime DEFAULT NULL,
  `Status` enum('Scheduled','Ongoing','Ended') NOT NULL DEFAULT 'Scheduled',
  `MeetingLink` varchar(255) NOT NULL,
  PRIMARY KEY (`MeetingID`),
  KEY `HostID` (`HostID`),
  KEY `GroupID` (`GroupID`),
  CONSTRAINT `meetings_ibfk_1` FOREIGN KEY (`HostID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `meetings_ibfk_2` FOREIGN KEY (`GroupID`) REFERENCES `Groups` (`GroupID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Message`
--

DROP TABLE IF EXISTS `Message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Message` (
  `MessageID` int NOT NULL AUTO_INCREMENT,
  `Timestamp` datetime NOT NULL,
  `SenderID` int NOT NULL,
  `MessageText` text NOT NULL,
  `GroupID` int DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`MessageID`),
  KEY `SenderID` (`SenderID`),
  KEY `GroupID` (`GroupID`),
  CONSTRAINT `message_ibfk_1` FOREIGN KEY (`SenderID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE,
  CONSTRAINT `message_ibfk_2` FOREIGN KEY (`GroupID`) REFERENCES `Groups` (`GroupID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `MessageRecipient`
--

DROP TABLE IF EXISTS `MessageRecipient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MessageRecipient` (
  `RecipientID` int NOT NULL,
  `MessageID` int NOT NULL,
  PRIMARY KEY (`RecipientID`,`MessageID`),
  KEY `MessageID` (`MessageID`),
  CONSTRAINT `messagerecipient_ibfk_1` FOREIGN KEY (`MessageID`) REFERENCES `Message` (`MessageID`) ON DELETE CASCADE,
  CONSTRAINT `messagerecipient_ibfk_2` FOREIGN KEY (`RecipientID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Notification`
--

DROP TABLE IF EXISTS `Notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('message','missed_call','other') NOT NULL,
  `content` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UserID` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_notification_user` (`UserID`),
  CONSTRAINT `fk_notification_user` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Task`
--

DROP TABLE IF EXISTS `Task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Task` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UserID` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_task_user` (`UserID`),
  CONSTRAINT `fk_task_user` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `PasswordHash` varchar(4000) NOT NULL,
  `FirstName` varchar(100) NOT NULL,
  `LastName` varchar(100) NOT NULL,
  `PasswordDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Username` (`Username`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-09 23:45:51
