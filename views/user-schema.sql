CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `phone` varchar(45) NOT NULL,
  `coc` varchar(45) NOT NULL
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
  `status` varchar(11) NOT NULL DEFAULT 'active',PRIMARY KEY(`id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;
