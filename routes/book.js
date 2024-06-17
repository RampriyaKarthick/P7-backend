const express = require('express');



const router = express.Router();
const Book = require('../models/book')
const bookCtrl = require('../controllers/book');
const auth= require('../middleware/auth')
const multer = require('../middleware/multer-config');

router.get('/', bookCtrl.getAllBooks);

router.get('/bestrating', bookCtrl.getTopThreeBooks);

router.get('/:id', bookCtrl.getSingleBook);



//authentication requis
router.post('/',auth,multer, bookCtrl.createBook);

router.post('/:id/rating', auth,bookCtrl.postBookRating);


 router.put('/:id', auth,multer, bookCtrl.updateEachBook);

router.delete('/:id',auth,bookCtrl.deleteBook );

  
module.exports = router;