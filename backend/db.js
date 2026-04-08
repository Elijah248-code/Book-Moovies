const mysql = require('mysql2/promise');

// Création d'un "pool" de connexion (plus performant qu'une connexion simple)
const pool = mysql.createPool({
    host: 'localhost', // L'adresse de ta base (127.0.0.1)
    user: 'root',      // Par défaut sur XAMPP/WAMP
    password: '',      // Par défaut, le mot de passe est vide sur WAMP/XAMPP (modifie si besoin)
    database: 'bookandmoovies',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Petit test pour vérifier que la connexion marche au démarrage
pool.getConnection()
    .then(() => console.log("✅ Connecté à la base de données MySQL !"))
    .catch((err) => console.error("❌ Erreur de connexion à MySQL :", err));

module.exports = pool;