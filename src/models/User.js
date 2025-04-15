import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    sparse: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: 'user'
  },
  score: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Middleware pour hacher le mot de passe avant de sauvegarder
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10); // Générer un sel
    this.password = await bcrypt.hash(this.password, salt); // Hacher le mot de passe
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

export default User;