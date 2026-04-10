-- Ajouter la colonne password_hash à la table utilisateurs
ALTER TABLE utilisateurs ADD COLUMN password_hash VARCHAR(255) AFTER Email;

-- Optionnel : Ajouter des timestamps
ALTER TABLE utilisateurs 
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;