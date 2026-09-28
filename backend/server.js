const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
const connectDB = async () => {
  let uri = process.env.MONGODB_URI;
  if (process.env.NODE_ENV === 'development') {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const dbPath = process.env.MONGODB_DATA_DIR || path.join(os.homedir(), '.learn-wolof', 'mongodb');
    fs.mkdirSync(dbPath, { recursive: true });
    const mongod = await MongoMemoryServer.create({ instance: { dbPath } });
    uri = mongod.getUri();
    console.log('Utilisation de MongoDB locale persistante en développement');
  }
  await mongoose.connect(uri);
  console.log('MongoDB connecté');
};

connectDB().then(async () => {
  if (process.env.NODE_ENV === 'development') {
    const { seedData } = require('./seed');
    await seedData();
  }
}).catch(err => console.log(err));

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes d'authentification
app.use('/api/auth', require('./routes/auth'));

// Routes des unités
app.use('/api/units', require('./routes/unit'));
// Routes des leçons
app.use('/api/lessons', require('./routes/lesson'));
// Routes de progression
app.use('/api/progress', require('./routes/progress'));

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));