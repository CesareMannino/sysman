-- MySQL dump 10.13  Distrib 8.0.25, for Win64 (x86_64)
--
-- Host: localhost    Database: nodejs-login
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.19-MariaDB

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
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `event_type` enum('INSERT','UPDATE') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=201 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `data` longblob DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email1` varchar(255) DEFAULT NULL,
  `email2` varchar(255) DEFAULT NULL,
  `resetToken` varchar(255) DEFAULT NULL,
  `passwordResetExpires` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=163 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `phone` varchar(45) NOT NULL,
  `coc` varchar(45) NOT NULL,
  `certificate_of_competence_date` text DEFAULT NULL,
  `covid_19_date` text DEFAULT NULL,
  `fitness_date` text DEFAULT NULL,
  `yellowF_date` text DEFAULT NULL,
  `PSSR_date` text DEFAULT NULL,
  `PSSRD` varchar(255) DEFAULT NULL,
  `covid_19D` varchar(255) DEFAULT NULL,
  `fitnessD` varchar(255) DEFAULT NULL,
  `SURVIVAL_date` text DEFAULT NULL,
  `FFB_date` text DEFAULT NULL,
  `ADV_date` text DEFAULT NULL,
  `elementary_date` text DEFAULT NULL,
  `MAMS_date` text DEFAULT NULL,
  `FRC_date` text DEFAULT NULL,
  `medical_first_date` text DEFAULT NULL,
  `medical_care_date` text DEFAULT NULL,
  `GMDSS_date` text DEFAULT NULL,
  `RADAR_date` text DEFAULT NULL,
  `ARPA_date` text DEFAULT NULL,
  `arpa_btw_date` text DEFAULT NULL,
  `ecdis_gen_date` text DEFAULT NULL,
  `SSO_date` text DEFAULT NULL,
  `leadership_managerial_date` text DEFAULT NULL,
  `high_voltage_date` text DEFAULT NULL,
  `leader_teamwork_engine_date` text DEFAULT NULL,
  `leader_teamwork_deck_date` text DEFAULT NULL,
  `security_awa_date` text DEFAULT NULL,
  `security_duties_date` text DEFAULT NULL,
  `basic_saf_fam_date` text DEFAULT NULL,
  `security_related_fam_date` text DEFAULT NULL,
  `ecdis_specific_date` text DEFAULT NULL,
  `yellowFD` varchar(255) DEFAULT NULL,
  `SURVD` varchar(255) DEFAULT NULL,
  `FFBD` varchar(255) DEFAULT NULL,
  `ADVD` varchar(255) DEFAULT NULL,
  `elementaryD` varchar(255) DEFAULT NULL,
  `MAMSD` varchar(255) DEFAULT NULL,
  `FRCD` varchar(255) DEFAULT NULL,
  `medical_firstD` varchar(255) DEFAULT NULL,
  `medical_careD` varchar(255) DEFAULT NULL,
  `GMDSSD` varchar(255) DEFAULT NULL,
  `RADARD` varchar(255) DEFAULT NULL,
  `ARPAD` varchar(255) DEFAULT NULL,
  `arpa_btwD` varchar(255) DEFAULT NULL,
  `ecdis_genD` varchar(255) DEFAULT NULL,
  `SSOD` varchar(255) DEFAULT NULL,
  `leadership_managerialD` varchar(255) DEFAULT NULL,
  `high_voltageD` varchar(255) DEFAULT NULL,
  `leader_teamwork_engineD` varchar(255) DEFAULT NULL,
  `leader_teamwork_deckD` varchar(255) DEFAULT NULL,
  `security_awaD` varchar(255) DEFAULT NULL,
  `security_dutiesD` varchar(255) DEFAULT NULL,
  `basic_saf_famD` varchar(255) DEFAULT NULL,
  `security_related_famD` varchar(255) DEFAULT NULL,
  `ecdis_specificD` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `status` varchar(11) NOT NULL DEFAULT 'active',
  `email_sent` tinyint(1) DEFAULT 0,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=443 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users_image`
--

DROP TABLE IF EXISTS `users_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_image` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `mob_no` int(11) NOT NULL,
  `user_name` varchar(20) NOT NULL,
  `password` varchar(15) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-09-10  9:40:06
