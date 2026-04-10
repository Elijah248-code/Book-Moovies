const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1', 
    user: 'root',      
    password: '',      
    database: 'bookandmoovies',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(() => console.log("✅Connecté à la base de données MySQL !"))
    .catch((err) => console.error("❌Erreur de connexion à MySQL :", err));

module.exports = pool;