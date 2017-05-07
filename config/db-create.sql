-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.1.22-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             9.4.0.5169
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for bib
CREATE DATABASE IF NOT EXISTS `bib` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `bib`;

-- Dumping structure for table bib.acl
CREATE TABLE IF NOT EXISTS `acl` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `CanAddMedia` tinyint(3) unsigned NOT NULL,
  `CanAddReaders` tinyint(3) unsigned NOT NULL,
  `CanAddUsers` tinyint(3) unsigned NOT NULL,
  `CanAddUserGroups` tinyint(3) unsigned NOT NULL,
  `CanRemoveMedia` tinyint(3) unsigned NOT NULL,
  `CanRemoveReaders` tinyint(3) unsigned NOT NULL,
  `CanRemoveUsers` tinyint(3) unsigned NOT NULL,
  `CanRemoveUserGroups` tinyint(3) unsigned NOT NULL,
  `CanModifyMedia` tinyint(3) unsigned NOT NULL,
  `CanModifyReaders` tinyint(3) unsigned NOT NULL,
  `CanModifyUsers` tinyint(3) unsigned NOT NULL,
  `CanModifyUserGroups` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table bib.borrow
CREATE TABLE IF NOT EXISTS `borrow` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `Reader_ID` bigint(20) unsigned NOT NULL,
  `Medium_ID` bigint(20) unsigned NOT NULL,
  `BorrowDate` date NOT NULL,
  `ReturnDate` date DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_BORROW_MEDIUM` (`Medium_ID`),
  KEY `FK_BORROW_READER` (`Reader_ID`),
  CONSTRAINT `FK_BORROW_MEDIUM` FOREIGN KEY (`Medium_ID`) REFERENCES `medium` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `FK_BORROW_READER` FOREIGN KEY (`Reader_ID`) REFERENCES `reader` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=265 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table bib.media_type
CREATE TABLE IF NOT EXISTS `media_type` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table bib.medium
CREATE TABLE IF NOT EXISTS `medium` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `Title` varchar(255) NOT NULL,
  `Author` varchar(255) DEFAULT NULL,
  `Description` varchar(1000) DEFAULT NULL,
  `Year` year(4) DEFAULT NULL,
  `ISBN` varchar(50) DEFAULT NULL,
  `Picture` text,
  `Type` bigint(20) unsigned DEFAULT NULL,
  `IsAvailable` tinyint(4) DEFAULT '1',
  `IsDeleted` tinyint(4) DEFAULT '0',
  `DevelopmentPlan` tinyint(4) DEFAULT '-1',
  PRIMARY KEY (`ID`),
  KEY `FK_MEDIA_TYPE` (`Type`),
  CONSTRAINT `FK_MEDIA_TYPE` FOREIGN KEY (`Type`) REFERENCES `media_type` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=175 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table bib.reader
CREATE TABLE IF NOT EXISTS `reader` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `Card_ID` varchar(100) DEFAULT '0',
  `FirstName` varchar(100) NOT NULL DEFAULT '0',
  `LastName` varchar(100) NOT NULL DEFAULT '0',
  `Phone` varchar(100) DEFAULT '0',
  `Address` varchar(100) DEFAULT '0',
  `IsActive` tinyint(3) unsigned DEFAULT '1',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table bib.user
CREATE TABLE IF NOT EXISTS `user` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `Group_ID` bigint(20) unsigned DEFAULT NULL,
  `ACL_ID` bigint(20) unsigned DEFAULT NULL,
  `AccountName` varchar(50) NOT NULL,
  `FirstName` varchar(50) NOT NULL,
  `LastName` varchar(50) NOT NULL,
  `Password` text NOT NULL,
  `IsActive` tinyint(3) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`ID`),
  KEY `FK_USER_ACL` (`ACL_ID`),
  KEY `FK_USER_USER_GROUP` (`Group_ID`),
  CONSTRAINT `FK_USER_ACL` FOREIGN KEY (`ACL_ID`) REFERENCES `acl` (`ID`),
  CONSTRAINT `FK_USER_USER_GROUP` FOREIGN KEY (`Group_ID`) REFERENCES `user_group` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table bib.user_group
CREATE TABLE IF NOT EXISTS `user_group` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `ACL_ID` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_USER_GROUP_ACL` (`ACL_ID`),
  CONSTRAINT `FK_USER_GROUP_ACL` FOREIGN KEY (`ACL_ID`) REFERENCES `acl` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table bib.user_settings
CREATE TABLE IF NOT EXISTS `user_settings` (
  `ID` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `User_ID` bigint(20) unsigned NOT NULL,
  `Language` tinytext NOT NULL,
  `DateTimeFormat` tinytext NOT NULL,
  `IsActive` tinyint(3) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`ID`),
  KEY `FK_USER_SETTINGS_USER` (`User_ID`),
  CONSTRAINT `FK_USER_SETTINGS_USER` FOREIGN KEY (`User_ID`) REFERENCES `user` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
