const express = require('express');
const router = express.Router(); //création d'une instance de l'objet Router pour y passer les middleware

const userCtrl = require('../controllers/user'); //controllers métiers

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;