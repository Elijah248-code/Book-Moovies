-- --------------------------------------------------------
-- Script de création de la base de données `bookandmoovies`
-- --------------------------------------------------------

-- On supprime les tables dans le bon ordre (à cause des clés étrangères)
DROP TABLE IF EXISTS `notes_film`;
DROP TABLE IF EXISTS `films`;
DROP TABLE IF EXISTS `utilisateurs`;

-- 1. Structure de la table `utilisateurs`
CREATE TABLE IF NOT EXISTS `utilisateurs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Pseudo` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL, -- Ta nouvelle colonne ici !
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_utilisateur_email` (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Structure de la table `films`
CREATE TABLE IF NOT EXISTS `films` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_api` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL, -- Ajouté ici pour ton API
  `Titre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Acteur` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Realisateur` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Categorie` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Note` FLOAT NOT NULL DEFAULT 0,
  `Nombre_note` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Structure de la table `notes_film`
CREATE TABLE IF NOT EXISTS `notes_film` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_utilisateur` int NOT NULL,
  `id_film` int NOT NULL,
  `Scenario` int NOT NULL,
  `Jeu_Acteur` int NOT NULL,
  `Qualite_Audiovisuel` int NOT NULL,
  `Commentaire` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_notes_film_utilisateur_film` (`id_utilisateur`,`id_film`),
  KEY `fk_notes_film_utilisateur` (`id_utilisateur`),
  KEY `fk_notes_film_film` (`id_film`),
  CONSTRAINT `fk_notes_film_utilisateur` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_notes_film_film` FOREIGN KEY (`id_film`) REFERENCES `films` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;