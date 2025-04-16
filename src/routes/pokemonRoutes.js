import express from 'express';
import Pokemon from '../models/Pokemon.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';


const router = express.Router();

// GET - Récupérer tous les pokémons avec pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Page actuelle
    const limit = parseInt(req.query.limit) || 12; // Nombre de pokémons par page
    const skip = (page - 1) * limit;

    const pokemons = await Pokemon.find({}).skip(skip).limit(limit);
    const total = await Pokemon.countDocuments();

    res.status(200).json({
      pokemons,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des pokémons",
      error: error.message,
    });
  }
});

// GET - Récupérer les types de pokémons
router.get('/types', (req, res) => {
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

// Remplacé avec "total" dans pagination

// // GET - Récupérer le nombre de pokémons (placer route statique avant dynamique)
// router.get('/count', async (req, res) => {
//   try {
//     const count = await Pokemon.countDocuments();
//     res.status(200).json({ count });
//   } catch (error) {
//     res.status(500).json({
//       message: "Erreur lors de la récupération du nombre de pokémons",
//       error: error.message
//     });
//   }
// });

// GET - Récupérer un pokémon par son ID
router.get('/:id', async (req, res) => {
  try {
    const pokemon = await Pokemon.findOne({ id: req.params.id });
    if (!pokemon) {
      return res.status(404).json({ message: "Pokémon non trouvé" });
    }
    res.status(200).json(pokemon);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du pokémon",
      error: error.message
    });
  }
});

// POST - Créer un nouveau pokémon
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    console.log("Requête pour créer un pokémon:", req.body);
    // Vérifier si l'ID existe déjà
    const existingPokemon = await Pokemon.findOne({ id: req.body.id });
    if (existingPokemon) {
      return res.status(400).json({ message: "Un pokémon avec cet ID existe déjà" });
    }
    const newPokemon = new Pokemon(req.body);
    await newPokemon.save();
    res.status(201).json(newPokemon);
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors de la création du pokémon",
      error: error.message
    });
  }
});

// PUT - Mettre à jour un pokémon
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updatedPokemon = await Pokemon.findOneAndUpdate(
      { id: parseInt(req.params.id, 10) },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPokemon) {
      return res.status(404).json({ message: "Pokémon non trouvé" });
    }
    res.status(200).json(updatedPokemon);
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors de la mise à jour du pokémon",
      error: error.message
    });
  }
});

// DELETE - Supprimer un pokémon
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const pokemonId = parseInt(req.params.id, 10);

    // Supprimer le Pokémon avec l'ID spécifié
    const deletedPokemon = await Pokemon.findOneAndDelete({ id: pokemonId });
    if (!deletedPokemon) {
      return res.status(404).json({ message: "Pokémon non trouvé" });
    }

    // Décaler les IDs des Pokémon ayant un ID supérieur à celui supprimé
    await Pokemon.updateMany(
      { id: { $gt: pokemonId } }, // Trouver les Pokémon avec un ID supérieur
      { $inc: { id: -1 } } // Décrémenter leur ID de 1
    );

    res.status(200).json({
      message: "Pokémon supprimé avec succès et IDs mis à jour",
      pokemon: deletedPokemon
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du pokémon",
      error: error.message
    });
  }
});

export default router;
