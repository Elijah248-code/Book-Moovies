-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mer. 08 avr. 2026
-- Version du serveur : 8.4.7
-- Version de PHP : 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `bookandmoovies`
--

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

DROP TABLE IF EXISTS `notes_film`;
DROP TABLE IF EXISTS `films`;
DROP TABLE IF EXISTS `utilisateurs`;

CREATE TABLE IF NOT EXISTS `utilisateurs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Pseudo` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_utilisateur_email` (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `films`
--

CREATE TABLE IF NOT EXISTS `films` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Titre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Acteur` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Realisateur` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Categorie` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Note` int NOT NULL DEFAULT 0,
  `Commentaire` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `Nombre_note` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------

--
-- Structure de la table `notes_film`
--

CREATE TABLE IF NOT EXISTS `notes_film` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_utilisateur` int NOT NULL,
  `id_film` int NOT NULL,
  `Scenario` int NOT NULL,
  `Jeu_Acteur` int NOT NULL,
  `Qualite_Audiovisuel` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_notes_film_utilisateur_film` (`id_utilisateur`,`id_film`),
  KEY `fk_notes_film_utilisateur` (`id_utilisateur`),
  KEY `fk_notes_film_film` (`id_film`),
  CONSTRAINT `fk_notes_film_utilisateur` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_notes_film_film` FOREIGN KEY (`id_film`) REFERENCES `films` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
