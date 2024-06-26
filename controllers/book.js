const Book = require('../models/book')
const fs = require('fs');


exports.createBook = (req, res, next) => {
  const userId = req.auth.userId


  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;

  const book = new Book({
    ...bookObject,
    userId,
   
    imageUrl:`${req.protocol}://${req.get('host')}/${req.file.path}`,

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
  
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (!book) {
             
                return res.status(404).json({ error: 'Book not found' });
            }
           
            res.status(200).json(book);
        })
      .catch(error => res.status(404).json({ error }));
  }


exports.updateEachBook = (req, res, next) => {
  let bookObject = {};
  if (req.file) {
    try {
          bookObject = {
              ...JSON.parse(req.body.book),
              imageUrl: `${req.protocol}://${req.get('host')}/${req.file.path}`
          };
      } catch (error) {
          console.error('Error parsing request body:', error);
          return res.status(400).json({ error: 'Invalid request body' });
      }
  } else {
    
      bookObject = { ...req.body };
  }

  delete bookObject._userId;

  Book.findOne({ _id: req.params.id })
      .then(book => {
          if (!book) {
              console.error('Book not found');
              return res.status(404).json({ message: 'Book not found' });
          }

          if (book.userId != req.auth.userId) {
              console.error('User not authorized');
              return res.status(401).json({ message: 'Not authorized' });
          }
          Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Book updated successfully!' }))
              .catch(error => {
                  console.error('Error updating book:', error);
                  res.status(500).json({ error });
              });
      })
      .catch(error => {
          console.error('Error finding book:', error);
          res.status(500).json({ error });
      });
};

  //  exports.deleteBook = (req, res, next) => {
  //   Book.deleteOne({ _id: req.params.id })
  //     .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
  //     .catch(error => res.status(400).json({ error }));
  // }

  exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
       .then(book => {
           if (book.userId != req.auth.userId) {
               res.status(401).json({message: 'Not authorized'});
           } else {
               const filename = book.imageUrl.split('/images/')[1];
               fs.unlink(`images/${filename}`, () => {
                   Book.deleteOne({_id: req.params.id})
                       .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                       .catch(error => res.status(401).json({ error }));
               });
           }
       })
       .catch( error => {
           res.status(500).json({ error });
       });
  }

  exports.getTopThreeBooks = (req, res, next) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(500).json({ error }));
};

exports.postBookRating = (req, res, next) => {
    const { userId, rating } = req.body;
    const bookId = req.params.id;

    if (rating < 0 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 0 and 5' });
    }

    Book.findOne({ _id: bookId })
        .then(book => {
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }
            const existingRating = book.ratings.find(r => r.userId === userId);
            if (existingRating) {
                return res.status(400).json({ message: 'User has already rated this book' });
            }
         book.ratings.push({ userId, grade: rating });

          
            const totalRatings = book.ratings.length;
            const averageRating = book.ratings.reduce((sum, r) => sum + r.grade, 0) / totalRatings;

          
            book.averageRating = averageRating;

            book.save()
                .then(updatedBook => res.status(200).json(updatedBook))
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};