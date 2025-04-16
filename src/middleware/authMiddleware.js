import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Middleware pour vérifier le token JWT
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Format attendu : "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: 'Accès non autorisé. Aucun token fourni.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ajouter les informations utilisateur à l'objet request

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré.', error: error.message });
  }
};

// Middleware pour vérifier le rôle de l'utilisateur
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {xw
    return res.status(403).json({ message: 'Accès interdit. Rôle administrateur requis.' });
  }
  next();
};

export { authMiddleware, adminMiddleware };