const express = require('express');
const router = express.Router();
const sanitize = require('../middleware/sanitize');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sauceCtrl = require('../controllers/sauce');



router.get('/', sanitize, auth, sauceCtrl.getAllSauce);
router.get('/:id', sanitize, auth, sauceCtrl.getOneSauce);
router.post('/', sanitize, auth, multer, sauceCtrl.createSauce);
router.put('/:id', sanitize, auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', sanitize, auth, sauceCtrl.deleteSauce);
router.post('/:id/like', sanitize, auth, sauceCtrl.voteSauce);


module.exports = router;