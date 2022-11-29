const mongoose = require('mongoose');
const MongooseErrors = require('mongoose-errors');

//Vérifie que l'utilisateur n'est pas déjà enregistré dans la base
const uniqueValidator = require('mongoose-unique-validator');

//Définit le format des données user
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

userSchema.plugin(MongooseErrors);
module.exports = mongoose.model('User', userSchema);