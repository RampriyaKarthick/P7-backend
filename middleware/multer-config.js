const multer = require('multer');
const sharp = require('sharp');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  
  if (MIME_TYPES[file.mimetype]) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = (req, res, next) => {
  upload.single('image')(req, res, function(err) {
    if (err) {
      return res.status(500).json({ error: err });
    }

    if (!req.file) {
      return next();
    }

    const filename = req.file.originalname.split(' ').join('_') + Date.now() + '.webp';

    sharp(req.file.buffer)
      .resize(500, 500, { fit: 'fill' }) 
      .toFormat('webp')
      .toFile(`images/${filename}`)
      .then(() => {
        req.file.path = `images/${filename}`;
        next();
      })
      .catch(err => res.status(500).json({ error: err }));
  });
};
