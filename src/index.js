import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import saveJson from './utils/saveJson.js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

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
const PORT = 3000;

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

//// RAJOUTER VALIDATION D'ENTREE

// Créer un nouveau pokémon
app.post('/api/pokemons/', (req, res) => {
    const newPokemon = req.body;
    const newPokemonId = req.body.id;
    if(pokemonsList.find((p) => p.id === newPokemonId)){
      res.status(404).json({ message: `Le pokémon #${newPokemonId} existe déjà` });
    }else{
      pokemonsList.push(newPokemon);
      saveJson(pokemonsList, path.join(__dirname, './data/pokemons.json'));
      res.status(200).json(pokemonsList);
    }
});

//// RAJOUTER VALIDATION D'ENTREE

// Mettre à jour un pokémon
app.put('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedPokemon = req.body;

    let pokemon = pokemonsList.find((p) => p.id === id);
    const indexOfPokemon = pokemonsList.indexOf(pokemon);

    if(pokemon){
      pokemonsList.splice(indexOfPokemon, 1, updatedPokemon);
      saveJson(pokemonsList, path.join(__dirname, './data/pokemons.json'));
      res.status(200).json(updatedPokemon); // Renvoie le Pokémon mis à jour
    }else{
      res.status(404).json({ message: `Le pokémon #${id} n'existe pas` });
    }
});

// Delete un pokémon
app.delete('/api/pokemons/:id', (req, res) =>{
  const id = parseInt(req.params.id);
  
  let pokemon = pokemonsList.find((p) => p.id === id);
  if(pokemon){
    pokemonsList = pokemonsList.filter((p) => p.id !== id);
    saveJson(pokemonsList, path.join(__dirname, './data/pokemons.json'));
    res.status(200).json(pokemon);
  }else{
    res.status(404).json({ message: `Le pokémon #${id} n'existe pas` });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
