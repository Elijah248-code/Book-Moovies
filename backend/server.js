const express = require('express');
const db = require('./db');
const cors = require('cors'); // N'oublie pas que tu l'as installé !
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors()); // Autorise la communication avec le Front
app.get('/api/films', async (req, res) => {
    try {
        // 1. On appelle l'API IMDb
        const response = await fetch('https://imdb236.p.rapidapi.com/api/imdb/cast/nm0000190/titles', {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '5cf9d8e0bemsh3004889fd362426p154b66jsnaa2a23cb51d4', // Mets ta vraie clé ici
                'x-rapidapi-host': 'imdb236.p.rapidapi.com'
            }
        });
        
        let films = await response.json();

        // 2. On filtre (on enlève ceux sans titre ou sans année)
        films = films.filter(film => film.originalTitle && film.startYear);

        // 3. On nettoie (on ne garde que l'essentiel pour le Front)
        films = films.map(film => {
            return {
                id: film.id,
                titre: film.originalTitle,
                annee: film.startYear,
                type: film.titleType || 'Inconnu',
                image: film.primaryImage ? film.primaryImage : 'Pas d\'image'
            };
        });

        // 4. On trie du plus récent au plus ancien
        films.sort((a, b) => b.annee - a.annee);

        // 5. On envoie le JSON tout propre
        res.json({
            total_resultats: films.length,
            films: films
        });

    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ error: "Impossible de récupérer les films" });
    }
});

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Serveur prêt et tri opérationnel sur http://localhost:${PORT}`);
});

app.post('/api/utilisateurs', async (req, res) => {
    try {

        const { pseudo, email } = req.body;

        if (!pseudo || !email) {
            return res.status(400).json({ error: "Le pseudo et l'email sont obligatoires." });
        }

        const requeteSQL = 'INSERT INTO utilisateurs (Pseudo, Email) VALUES (?, ?)';
        
        const [resultat] = await db.execute(requeteSQL, [pseudo, email]);

        res.status(201).json({ 
            message: "Utilisateur créé avec succès !",
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: "Cet email est déjà utilisé." });
        }
        console.error("Erreur serveur :", error);
        res.status(500).json({ error: "Impossible de créer l'utilisateur." });
    }
});