const multer = require('multer');
const fs = require('fs');


//Dictionnaire des types de fichiers image
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// teste l'existence ou non du repertoire "images"
const dir = './images';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

/** Crée un nom de fichier avec timestamp & enregistre via multer  */
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, dir);
  },
  filename: (req, file, callback) => {
    //const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, /*name +*/ Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');