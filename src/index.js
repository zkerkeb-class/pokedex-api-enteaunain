import express from 'express';
import cors from 'cors';
import pokemonsList from './data/pokemonsList.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Obtenir le chemin absolu du fichier actuel en utilisant les modules ES
const __filename = fileURLToPath(import.meta.url);
// __filename contient le chemin complet du fichier actuel

// Obtenir le chemin absolu du répertoire actuel
const __dirname = path.dirname(__filename);
// __dirname contient le chemin complet du répertoire où se trouve le fichier actuel

const app = express();
const PORT = 3000;

console.log(process.env);

// Middleware pour CORS
app.use(cors());

// Middleware pour parser le JSON
app.use(express.json());

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
  
  app.get("/", (req, res) => {
    res.send("bienvenue sur l'API Pokémon");
  });

// Route GET de base
app.get('/api/pokemons', (req, res) => {
    res.json(pokemonsList);
});

// GET pokémon en particulier
app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemon = pokemonsList.find((p) => p.id === id);

    if (pokemon) {
        res.json(pokemon);
    } else {
        res.status(404).json({ message: `Le pokémon #${id} n'existe pas` });
    }
});

// Créer un nouveau pokémon
app.post('/api/pokemons', (req, res) => {
    const newPokemon = req.body;
    pokemonsList.push(newPokemon);
    res.status(200).json(newPokemon);
});

// Mettre à jour un pokémon
app.patch('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedPokemon = req.body;

    let pokemon = pokemonsList.find((p) => p.id === id);

    if(pokemon){
      pokemonsList[id - 1] = req.body;
      res.status(200).json(pokemonsList[id - 1]);
    }else{
      res.status(404).json({ message: `Le pokémon #${id} n'existe pas` });
    }
    
});

// Delete un pokémon
app.delete('/api/pokemons/:id', (req, res) =>{
  const id = parseInt(req.params.id);
  
  let pokemon = pokemonsList.find((p) => p.id === id);
  if(pokemon){
    pokemonsList.splice(id-1,1);
    res.status(200).json(pokemon);
  }else{
    res.status(404).json({ message: `Le pokémon #${id} n'existe pas` });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
