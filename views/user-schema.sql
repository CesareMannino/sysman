CREATE TABLE IF NOT EXISTS 
`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `phone` varchar(45) NOT NULL,
  `coc` varchar(45) NOT NULL,
  `expiration` varchar(19) NOT NULL,
  `PSSR` varchar(11) NOT NULL,
  `FFB` varchar(11) NOT NULL,
  `ADV` varchar(11) NOT NULL,
  `status` varchar(11) NOT NULL DEFAULT 'active'
,PRIMARY KEY (`id`)) ENGINE=InnoDB;
