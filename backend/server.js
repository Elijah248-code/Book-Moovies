const express = require('express');
const db = require('./db');
const cors = require('cors');
const { router: authRouter } = require('./routes/auth');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// Routes d'authentification
app.use('/api/auth', authRouter);

/**
 * ROUTE 1 : Récupérer les films pour le Front-end
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
 * ROUTE 2 : Importation Action (Filtre films sortis uniquement)
 */
app.get('/api/remplir-action', async (req, res) => {
    try {
        console.log("🧹 Nettoyage de la base...");
        await db.execute('SET FOREIGN_KEY_CHECKS = 0');
        await db.execute('TRUNCATE TABLE films');
        await db.execute('SET FOREIGN_KEY_CHECKS = 1');

        console.log("⏳ Récupération de la liste initiale...");
        const listResp = await fetch('https://imdb236.p.rapidapi.com/api/imdb/cast/nm0000129/titles', {
            headers: {
                'x-rapidapi-key': '5cf9d8e0bemsh3004889fd362426p154b66jsnaa2a23cb51d4',
                'x-rapidapi-host': 'imdb236.p.rapidapi.com'
            }
        });
        
        const data = await listResp.json();
        if (!Array.isArray(data)) return res.status(400).json({ erreur: "Erreur API" });

        let filmsAjoutes = 0;

        // On parcourt la liste jusqu'à avoir 10 films avec des notes
        for (const f of data) {
            if (filmsAjoutes >= 10) break;

            console.log(`🎬 Analyse de : ${f.originalTitle}`);

            const detailResp = await fetch(`https://imdb236.p.rapidapi.com/api/imdb/title/${f.id}`, {
                headers: {
                    'x-rapidapi-key': '5cf9d8e0bemsh3004889fd362426p154b66jsnaa2a23cb51d4',
                    'x-rapidapi-host': 'imdb236.p.rapidapi.com'
                }
            });
            const d = await detailResp.json();

            // LE FILTRE : On ne prend que les films qui ont une note (donc déjà sortis)
            if (d.averageRating && d.averageRating > 0) {
                const realisateur = d.directors?.[0]?.name || "Inconnu";
                const casting = d.cast?.slice(0, 3).map(c => c.name).join(', ') || "Tom Cruise";

                const sql = `INSERT INTO films (id_api, Titre, Realisateur, Acteur, Note, Nombre_note, Categorie) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                await db.execute(sql, [
                    f.id,
                    d.originalTitle || f.originalTitle,
                    realisateur,
                    casting,
                    d.averageRating,
                    d.numVotes || 0,
                    d.genres?.join(', ') || "Action"
                ]);

                filmsAjoutes++;
                console.log(`✅ Ajouté : ${d.originalTitle} (${d.averageRating}/10)`);
            } else {
                console.log(`⏭️ Ignoré (Pas de note)`);
            }
        }

        // ON ENVOIE LA RÉPONSE ICI (Après la boucle !)
        res.json({ message: `Succès ! ${filmsAjoutes} vrais films ont été importés.` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors du remplissage" });
    }
});

/**
 * ROUTE 3 : Inscription utilisateur
 */
app.post('/api/utilisateurs', async (req, res) => {
    try {
        const { pseudo, email } = req.body;
        if (!pseudo || !email) return res.status(400).json({ error: "Champs manquants" });
        const [resultat] = await db.execute('INSERT INTO utilisateurs (Pseudo, Email) VALUES (?, ?)', [pseudo, email]);
        res.status(201).json({ message: "Utilisateur créé !", id: resultat.insertId });
    } catch (error) {
        res.status(500).json({ error: "Erreur création utilisateur" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur prêt sur http://localhost:${PORT}`);
});