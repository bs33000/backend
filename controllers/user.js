const bcrypt = require('bcrypt'); //hash du mot de passe
const User = require('../models/user');
const jwt = require('jsonwebtoken'); //gestion des tokens

// sign-up - new user
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(error.statusCode).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// login - existing user
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'}); //user non trouvé
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' }); //mauvais password
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: '24h' } // génère le token d'identification valable 24h
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(error.statusCode).json({ error }));
};