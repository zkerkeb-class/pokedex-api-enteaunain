import mongoose from 'mongoose';

const pokemonSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    english: { type: String, required: true },
    japanese: { type: String },
    chinese: { type: String },
    french: { type: String }
  },
  type: [{
    type: String,
    enum: [
      "fire", "water", "grass", "electric", "ice", "fighting",
      "poison", "ground", "flying", "psychic", "bug", "rock",
      "ghost", "dragon", "dark", "steel", "fairy", "normal"
    ]
  }],
  stats: {
    hp: Number,
    attack: Number,
    defense: Number,
    specialAttack: Number,
    specialDefense: Number,
    speed: Number
  },image: {
    type: String
  },
  evolutions: [{
    type: Number,
    ref: 'Pokemon'
  }]
}, {
  timestamps: true
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

export default Pokemon;
