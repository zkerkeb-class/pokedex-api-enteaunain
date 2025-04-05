import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Pokemon from '../src/models/Pokemon.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/pokedex')
.then(() => console.log('Connexion à MongoDB réussie'))
.catch(err => {
  console.error('Erreur de connexion à MongoDB:', err);
  process.exit(1);
});

// Lecture du fichier JSON
const jsonPath = path.join(dirname, '..', 'src/data', 'pokemons.json');
const pokemonsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Fonction pour convertir les types en minuscules
const convertType = type => type.toLowerCase();

// Fonction pour transformer les données JSON au format du schéma Mongoose
const transformPokemonData = pokemonData => {
  return {
    id: pokemonData.id,
    name: pokemonData.name,
    type: pokemonData.type.map(convertType),
    image: pokemonData.image,
    stats: {
      hp: pokemonData.base["HP"],
      attack: pokemonData.base["Attack"],
      defense: pokemonData.base["Defense"],
      specialAttack: pokemonData.base["Sp. Attack"],
      specialDefense: pokemonData.base["Sp. Defense"],
      speed: pokemonData.base["Speed"]
    },
    evolutions: [] // Nous n'avons pas de données d'évolution dans le JSON
  };
};

// Fonction pour importer tous les Pokémon
const importPokemons = async () => {
  try {
    // Suppression des données existantes (optionnel)
    await Pokemon.deleteMany({});
    console.log('Anciennes données supprimées');

    // Transformation et insertion des nouvelles données
    const transformedData = pokemonsData.map(transformPokemonData);
    const result = await Pokemon.insertMany(transformedData);

    console.log(`${result.length} Pokémon ont été importés avec succès`);
    mongoose.disconnect();
  } catch (error) {
    console.error('Erreur lors de l\'importation des données:', error);
    mongoose.disconnect();
    process.exit(1);
  }
};

// Démarrage de l'importation
importPokemons();