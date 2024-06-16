const express = require('express');

const app = express();
const mongoose = require('mongoose');
const Book = require('./models/book');
const bookRoutes = require('./routes/book');

mongoose.connect('mongodb+srv://rampriyakarthick:0xRY9RCXk8trgylI@cluster0.uwfvjpp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use('/api/books', bookRoutes);

module.exports = app;