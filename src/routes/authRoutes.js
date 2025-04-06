import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Assurez-vous que le modèle User est correctement importé
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { authMiddleware } from '../middleware/authMiddleware.js'; // Import du middleware

const router = express.Router();

dotenv.config();

// POST - Créer un nouvel utilisateur
router.post('/register', async (req, res) => {
    try {
      const { email, name, password, role } = req.body;
  
      // Vérification des champs requis
      if (!email || !name || !password) {
        return res.status(400).json({ message: 'Email, nom et mot de passe sont requis.' });
      }
  
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Un utilisateur avec cet email existe déjà.' });
      }
  
      // Créer un nouvel utilisateur
      const newUser = new User({
        email,
        name,
        password,
        role: role || 'user'
      });
  
      // Sauvegarder l'utilisateur dans la base de données
      await newUser.save();
      res.status(201).json({ message: 'Utilisateur créé avec succès.', user: newUser });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur.', error: error.message });
    }
  });

  // POST - Connexion d'un utilisateur
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Vérification des champs requis
      if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
      }
  
      // Vérifier si l'utilisateur existe
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Identifiants invalides.' });
      }
  
      // Vérifier si le mot de passe est correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Identifiants invalides.' });
      }
  
      // Générer un JWT
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '12h' }
      );
  
      // Réponse avec le JWT
      res.status(200).json({ message: 'Connexion réussie.', token });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la connexion.', error: error.message });
    }
  });

  // GET - Route profil utilisateur
router.get('/profile', authMiddleware, async (req, res) => {
    try {
      // Accéder aux informations utilisateur depuis req.user
      const user = await User.findOne({ email: req.user.email });
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      }
  
      res.status(200).json({ message: 'Profil utilisateur récupéré avec succès.', user });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération du profil.', error: error.message });
    }
  });


export default router;