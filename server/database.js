const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('URI MongoDB non définie');
    }

    await mongoose.connect(uri);
    console.log('Connecté à MongoDB');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error);
    process.exit(1);
  }
};

// Gestion des événements de connexion
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB déconnecté');
});

mongoose.connection.on('error', (err) => {
  console.error('Erreur MongoDB:', err);
});

module.exports = connectDB