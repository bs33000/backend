const express = require('express');
const router = express.Router(); //création d'une instance de l'objet Router pour y passer les middleware
const sanitize = require('../middleware/sanitize');
const userCtrl = require('../controllers/user'); //controllers métiers

router.post('/signup', sanitize, userCtrl.signup);
router.post('/login', sanitize, userCtrl.login);

module.exports = router;