const express = require('express');
const db = require('./db');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MWU1ZTA0ZWJlY2RmM2EyNWViNjBiNzM3MDkyOTNmNyIsIm5iZiI6MTc3NjA2NDY2My44OTUsInN1YiI6IjY5ZGM5ODk3NDc1YTUyNTkwZmQ5MzU3ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.n3ZD2LAPhald_Cb5jwQHJkIF5f7DWhWYlqnKtKWavls';

/**
 * ROUTE 1 
*/
app.get('/api/films', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM films ORDER BY Note DESC');
        res.json(rows);
    } catch (error) {
        console.error("Erreur SQL :", error);
        res.status(500).json({ error: "Impossible de récupérer les films" });
    }
});

/**
 * ROUTE 2 : Importation TMDB
 */
app.get('/api/import-auto', async (req, res) => {
    try {
        const [count] = await db.query('SELECT COUNT(*) as total FROM films');
        if (count[0].total > 0) return res.json({ message: "Base déjà pleine" });
        const API_KEY = '91e5e04ebecdf3a25eb60b73709293f7'; 
        console.log("🚀 Appel à TMDB...");
        const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=fr-FR&page=1`;
        const resp = await fetch(url);
        if (!resp.ok) {
            const errorText = await resp.text();
            console.error("❌ Erreur TMDB :", errorText);
            return res.status(resp.status).json({ error: "Problème avec la clé API" });
        }
        const data = await resp.json();
        if (data.results && data.results.length > 0) {
            console.log(`🎬 ${data.results.length} films trouvés. Insertion...`);
            for (const f of data.results) {
                const img = f.poster_path ? `https://image.tmdb.org/t/p/w500${f.poster_path}` : '';
                await db.execute(sql, [f.id.toString(), f.title, "TMDB", "Casting", f.vote_average, f.vote_count, img]);
                const sql = `INSERT INTO films (id_api, Titre, Realisateur, Acteur, Note, Nombre_note, Categorie) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                await db.execute(sql, [
                    f.id.toString(),
                    f.title,
                    "TMDB Studios",
                    "Casting TMDB",
                    f.vote_average,
                    f.vote_count,
                    img 
                ]);
            }
            res.json({ message: "Importation TMDB réussie !" });
        } else {
            res.json({ message: "Aucun film trouvé." });
        }

    } catch (error) {
        console.error("Crash serveur :", error.message);
        res.status(500).json({ error: "Erreur lors de l'import" });
    }
});
/**
 * ROUTE 3 : Connexion 
 */
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await db.query('SELECT * FROM utilisateurs WHERE Email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ error: "Utilisateur non trouvé" });
        }
        const user = users[0];
        if (password !== user.password_hash) {
            return res.status(401).json({ error: "Mot de passe incorrect" });
        }
        res.json({
            id: user.id,
            pseudo: user.Pseudo,
            email: user.Email,
            message: "Connexion réussie !"
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur login" });
    }
});
/**
 * ROUTE 4 : Inscription (
 */
app.post('/api/auth/register', async (req, res) => {
    try {
        const { pseudo, email, password } = req.body;
        if (!pseudo || !email || !password) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires" });
        }
        const sql = `INSERT INTO utilisateurs (Pseudo, Email, password_hash) VALUES (?, ?, ?)`;
        await db.execute(sql, [pseudo, email, password]);
        res.status(201).json({ message: "Utilisateur créé !" });
    } catch (error) {
        console.error("ERREUR SQL :", error.message);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "Cet email est déjà utilisé." });
        }
        res.status(500).json({ error: "Erreur serveur register" });
    }
});
app.listen(PORT, () => {
    console.log(`🚀 Serveur prêt sur http://localhost:${PORT}`);
});