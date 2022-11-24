const mongoose = require('mongoose');

//Vérifie que l'utilisateur n'est pas déjà enregistré dans la base
const uniqueValidator = require('mongoose-unique-validator');

//Définit le format des données user
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);