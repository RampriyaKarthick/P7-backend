const Book = require('../models/book')


exports.createBook = (req, res, next) => {
  const userId = req.auth.userId


  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;

  const book = new Book({
    ...bookObject,
    userId,
    imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`,

});

    book.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error =>{
        console.error('Create Book Error:', error);
        res.status(400).json({ error :error});
      })
  };

  exports.getAllBooks = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
  }

  exports.getSingleBook = (req, res, next) => {
    console.log('Received request for book ID:', req.params.id);
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (!book) {
                console.log('Book not found');
                return res.status(404).json({ error: 'Book not found' });
            }
            console.log('Book found:', book);
            res.status(200).json(book);
        })
      .catch(error => res.status(404).json({ error }));
  }

  exports.updateEachBook =(req, res, next) => {
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
       .then(() => res.status(200).json({ message: 'Objet modifié !'}))
       .catch(error => res.status(400).json({ error }));
   }

   exports.deleteBook = (req, res, next) => {
    Book.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
  }

  exports.getTopThreeBooks = (req, res, next) => {

  }

  exports.postBookRating = (req, res, next) => {
    
  }