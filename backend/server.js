const express = require('express');
const app = express();
const PORT = 3000;

app.get('/api/message', (req, res) => {
    res.json({ message: "Hello depuis le serveur Node !" });
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});