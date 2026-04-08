const express = require('express');
const router = express.Router(); // L'outil magique d'Express pour séparer les routes

const IMDB_KEY = 'TA_CLE_ICI';

// ⚠️ Attention ici : on met juste '/' car le préfixe sera géré dans server.js
router.get('/', async (req, res) => {
    try {
        const response = await fetch('https://imdb236.p.rapidapi.com/api/imdb/cast/nm0000190/titles', {
            method: 'GET',
            headers: {
                'x-rapidapi-key': IMDB_KEY,
                'x-rapidapi-host': 'imdb236.p.rapidapi.com'
            }
        });
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Impossible de récupérer les films" });
    }
});

// Ne surtout pas oublier d'exporter le routeur à la fin !
module.exports = router;