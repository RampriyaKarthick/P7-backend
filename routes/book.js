const express = require('express');

const router = express.Router();
const Book = require('../models/book')
const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getAllBooks);

//authentication requis
router.post('/',  bookCtrl.createBook);

 router.get('/:id ', bookCtrl.getSingleBook);

 router.put('/:id', bookCtrl.updateEachBook);

  router.delete('/:id ',bookCtrl.deleteBook );

module.exports = router;