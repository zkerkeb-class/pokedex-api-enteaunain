import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import saveJson from './utils/saveJson.js';
import fs from 'fs';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import pokemonRoutes from "./routes/pokemonRoutes.js";

dotenv.config();

connectDB();

// Obtenir le chemin absolu du fichier actuel en utilisant les modules ES
const __filename = fileURLToPath(import.meta.url);
// __filename contient le chemin complet du fichier actuel

// Obtenir le chemin absolu du répertoire actuel
const __dirname = path.dirname(__filename);
// __dirname contient le chemin complet du répertoire où se trouve le fichier actuel

const pokemonsList = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./data/pokemons.json"), "utf8")
);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour CORS
app.use(cors());

// Middleware pour parser le JSON
app.use(express.json());

// Configuration CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware pour servir des fichiers statiques
// 'app.use' est utilisé pour ajouter un middleware à notre application Express
// '/assets' est le chemin virtuel où les fichiers seront accessibles
// 'express.static' est un middleware qui sert des fichiers statiques
// 'path.join(__dirname, '../assets')' construit le chemin absolu vers le dossier 'assets'
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Route GET de base
app.get("/api/pokemons/types", (req, res) => {
    res.status(200).send({
      types: [
        "fire",
        "water",
        "grass",
        "electric",
        "ice",
        "fighting",
        "poison",
        "ground",
        "flying",
        "psychic",
        "bug",
        "rock",
        "ghost",
        "dragon",
        "dark",
        "steel",
        "fairy",
      ]
    });
  });
  

// Routes
app.use("/api/pokemons", pokemonRoutes);

// Route de base
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API Pokémon avec MongoDB");
});

// Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur http://0.0.0.0:${PORT}`);
});


// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
