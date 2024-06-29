require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
// const cors = require('cors');
const Book = require('./models/book');
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const path = require('path');
const fs = require('fs');

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());
// app.use(cors());
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}
app.use('/images', express.static(imagesDir));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use('/api/books', bookRoutes);

  app.use('/api/auth', userRoutes);

module.exports = app;