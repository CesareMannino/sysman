CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `phone` varchar(45) NOT NULL,
  `coc` varchar(45) NOT NULL,
  `expiration` varchar(19) NOT NULL,
  `PSSR` varchar(11) NOT NULL,
  `SURV` varchar(45) NOT NULL,
  `FFB` varchar(11) NOT NULL,
  `ADV` varchar(11) NOT NULL,
  `elementary` varchar(11) NOT NULL,
  `MAMS` varchar(45) NOT NULL,
  `FRC` varchar(45) NOT NULL,
  `medical_first` varchar(11) NOT NULL,
  `medical_care` varchar(11) NOT NULL,
  `GMDSS` varchar(11) NOT NULL,
  `RADAR` varchar(11) NOT NULL,
  `ARPA` varchar(11) NOT NULL,
  `arpa_btw` varchar(11) NOT NULL,
  `ecdis_gen` varchar(11) NOT NULL,
  `SSO` varchar(11) NOT NULL,
  `leadership_managerial` varchar(11) NOT NULL,
  `high_voltage` varchar(11) NOT NULL,
  `leader_teamwork_engine` varchar(11) NOT NULL,
  `leader_teamwork_deck` varchar(11) NOT NULL,
  `security_awa` varchar(11) NOT NULL,
  `security_duties` varchar(11) NOT NULL,
  `basic_saf_fam` varchar(11) NOT NULL,
  `security_related_fam` varchar(11) NOT NULL,
  `ecdis_specific` varchar(11) NOT NULL,
  `user_id` varchar(11) NOT NULL,
  `status` varchar(11) NOT NULL DEFAULT 'active',
   PRIMARY KEY (`id`)) ENGINE=InnoDB;


CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `phone` varchar(45) NOT NULL,
  `coc` varchar(45) NOT NULL,
  `expiration` varchar(19) NOT NULL,
  `covid_19` varchar(45) NOT NULL,
  `fitness` varchar(45) NOT NULL,
  `yellowF` varchar(45) NOT NULL,
  `PSSR` varchar(45) NOT NULL,
  `PSSRD` varchar(45) DEFAULT NULL,
  `covid_19D` varchar(100) DEFAULT NULL,
  `fitnessD` varchar(45) DEFAULT NULL,
  `SURVIVAL` varchar(45) NOT NULL,
  `FFB` varchar(45) NOT NULL,
  `ADV` varchar(45) NOT NULL,
  `elementary` varchar(11) NOT NULL,
  `MAMS` varchar(45) NOT NULL,
  `FRC` varchar(45) NOT NULL,
  `medical_first` varchar(11) NOT NULL,
  `medical_care` varchar(11) NOT NULL,
  `GMDSS` varchar(11) NOT NULL,
  `RADAR` varchar(11) NOT NULL,
  `ARPA` varchar(11) NOT NULL,
  `arpa_btw` varchar(11) NOT NULL,
  `ecdis_gen` varchar(11) NOT NULL,
  `SSO` varchar(11) NOT NULL,
  `leadership_managerial` varchar(11) NOT NULL,
  `high_voltage` varchar(11) NOT NULL,
  `leader_teamwork_engine` varchar(11) NOT NULL,
  `leader_teamwork_deck` varchar(11) NOT NULL,
  `security_awa` varchar(11) NOT NULL,
  `security_duties` varchar(11) NOT NULL,
  `basic_saf_fam` varchar(11) NOT NULL,
  `security_related_fam` varchar(11) NOT NULL,
  `ecdis_specific` varchar(11) NOT NULL,
  `yellowFD` varchar(45) NOT NULL,
  `SURVD` varchar(45) NOT NULL,
  `FFBD` varchar(45) NOT NULL,
  `ADVD` varchar(45) NOT NULL,
  `elementaryD` varchar(45) NOT NULL,
  `MAMSD` varchar(45) NOT NULL,
  `FRCD` varchar(45) NOT NULL,
  `medical_firstD` varchar(45) NOT NULL,
  `medical_careD` varchar(45) NOT NULL,
  `GMDSSD` varchar(45) NOT NULL,
  `RADARD` varchar(45) NOT NULL,
  `ARPAD` varchar(45) NOT NULL,
  `arpa_btwD` varchar(45) NOT NULL,
  `ecdis_genD` varchar(45) NOT NULL,
  `SSOD` varchar(45) NOT NULL,
  `leadership_managerialD` varchar(45) NOT NULL,
  `high_voltageD` varchar(45) NOT NULL,
  `leader_teamwork_engineD` varchar(45) NOT NULL,
  `leader_teamwork_deckD` varchar(45) NOT NULL,
  `security_awaD` varchar(45) NOT NULL,
  `security_dutiesD` varchar(45) NOT NULL,
  `basic_saf_famD` varchar(45) NOT NULL,
  `security_related_famD` varchar(45) NOT NULL,
  `ecdis_specificD` varchar(45) NOT NULL,
  `user_id` varchar(11) NOT NULL,
  `status` varchar(11) NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;