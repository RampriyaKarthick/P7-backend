const express = require('express');

const router = express.Router();
const Book = require('../models/book')
const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getAllBooks);

router.get('/bestrating ', bookCtrl.getTopThreeBooks);

router.get('/:id ', bookCtrl.getSingleBook);



//authentication requis
router.post('/',  bookCtrl.createBook);

router.post('/:id/rating',bookCtrl.postBookRating);


 router.put('/:id', bookCtrl.updateEachBook);

router.delete('/:id ',bookCtrl.deleteBook );

  
module.exports = router;