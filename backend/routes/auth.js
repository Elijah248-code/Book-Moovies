const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const JWT_SECRET = 'votre_secret_jwt_super_securise'; // À mettre dans .env en production

/**
 * INSCRIPTION
 */
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
        }
        
        // Vérifier si l'utilisateur existe déjà
        const [existing] = await db.execute(
            'SELECT id FROM utilisateurs WHERE email = ? OR Pseudo = ?', 
            [email, username]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Cet email ou pseudo est déjà utilisé' });
        }
        
        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Créer l'utilisateur
        const [result] = await db.execute(
            'INSERT INTO utilisateurs (Pseudo, Email, password_hash) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        
        // Créer le token JWT
        const token = jwt.sign(
            { userId: result.insertId, username, email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.status(201).json({
            message: 'Inscription réussie !',
            token,
            user: {
                id: result.insertId,
                username,
                email
            }
        });
        
    } catch (error) {
        console.error('Erreur inscription:', error);
        res.status(500).json({ error: 'Erreur serveur lors de l\'inscription' });
    }
});

/**
 * CONNEXION
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }
        
        // Trouver l'utilisateur
        const [users] = await db.execute(
            'SELECT id, Pseudo, Email, password_hash FROM utilisateurs WHERE Email = ?',
            [email]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }
        
        const user = users[0];
        
        // Vérifier le mot de passe
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }
        
        // Créer le token JWT
        const token = jwt.sign(
            { userId: user.id, username: user.Pseudo, email: user.Email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.json({
            message: 'Connexion réussie !',
            token,
            user: {
                id: user.id,
                username: user.Pseudo,
                email: user.Email
            }
        });
        
    } catch (error) {
        console.error('Erreur connexion:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
    }
});

/**
 * MIDDLEWARE D'AUTHENTIFICATION
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
        return res.status(401).json({ error: 'Token d\'accès requis' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token invalide' });
        }
        req.user = user;
        next();
    });
};

/**
 * PROFIL UTILISATEUR (route protégée)
 */
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const [users] = await db.execute(
            'SELECT id, Pseudo, Email FROM utilisateurs WHERE id = ?',
            [req.user.userId]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        
        res.json({
            user: {
                id: users[0].id,
                username: users[0].Pseudo,
                email: users[0].Email
            }
        });
        
    } catch (error) {
        console.error('Erreur profil:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = { router, authenticateToken };