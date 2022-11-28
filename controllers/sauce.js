const Sauce = require('../models/sauce');
const fs = require('fs');

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(404).json({ error }));
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {
            res.status(403).json({message: 'unauthorized request'});
        } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch( error => {
        res.status(500).json({ error });
    });
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id; // delete l'id par défaut à la faveur de celui généré par MongoDB
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });

    sauce.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
};


/** Attention: 2 cas de figures selon que le user a transmis ou non un fichier
* => on doit tester si l'objetSauce récupéré contient un fichier: req.file?
* 1. avec fichier: alors la requete est transmise sous forme de string
*      -> parse
*      -> on recrée le chemin du fichier image
* 2. sans fichier: on récupère le corps de la requete tel quel
*/
 exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
            res.status(403).json({ message : 'unauthorized request'});
        } else {
            if (req.file){
                const filename = sauce.imageUrl.split('/images/')[1];
                // suppression du fichier existant, trouvé via l'id de la sauce à modifier
                fs.unlink(`images/${filename}`,()=>{});
                // chemin du nouveau fichier
                sauce.imageUrl = sauceObject.imageUrl;
            }

            Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Objet modifié!'}))
            .catch(error => res.status(400).json({ error }));
        }
    })
    .catch((error) => {
        res.status(400).json({ error });
    });
};


exports.voteSauce = (req, res, next) => {
    const like = req.body.like; // like = {1,-1,0}
    const user = req.body.userId;
    Sauce.findOne({_id: req.params.id})//On sélectionne la sauce par son id
    .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
            res.status(403).json({ message : 'unauthorized request'});
        } else {
            //Teste le statut du like
            switch(like) {
                case 1:// like=1 et tableau usersLiked ne contient pas déjà l'id
                    if(!sauce.usersLiked.includes(user)){
                        Sauce.updateOne({_id: req.params.id}, {
                            $inc: {likes: 1},//on ajoute 1 au likes
                            $push: {usersLiked: user}//et on ajoute l'id de l'utilisateur au tableau usersLiked
                        }, {_id: req.params.id})
                        .then(() => res.status(200).json({message: 'Vote positif !'}))
                        .catch(error => res.status(400).json({error}))
                    }
                    else {
                        res.status(400).json({message: 'Vote déjà enregistré'})
                    }
                break;
                case -1://like= -1 tableau usersDisliked ne contient pas déjà l'id
                    if(!sauce.usersDisliked.includes(user)){
                        Sauce.updateOne({_id: req.params.id}, {
                            $inc: {dislikes: 1},//on ajoute 1 à dislikes
                            $push: {usersDisliked: user}//et on ajoute l'userId au tableau usersDisliked
                        }, {_id: req.params.id})
                        .then(() => res.status(200).json({message: 'Vote négatif !'}))
                        .catch(error => res.status(400).json({error}))
                    }
                    else {
                        res.status(400).json({message: 'Vote déjà enregistré'})
                    }
                break;
                case 0://s'il est égale à 0
                    if (sauce.usersLiked.includes(user)) {//et que usersLiked contient l'userId
                        Sauce.updateOne({_id: req.params.id}, {
                            $inc: {likes: -1},//on retire 1 à likes
                            $pull: {usersLiked: user}//et on sort l'id du tableau usersLiked
                        }, {_id: req.params.id})
                        .then(() => res.status(200).json({message: 'Vote réinitialisé !'}))
                        .catch(error => res.status(400).json({error}))
                    } else if (sauce.usersDisliked.includes(user)) {//et que usersDisliked contient l'userId
                        Sauce.updateOne({_id: req.params.id}, {
                            $inc: {dislikes: -1},//on retire 1 à dislikes
                            $pull: {usersDisliked: user}//et on sort l'id du tableau usersDisliked
                        } , {_id: req.params.id})
                        .then(() => res.status(200).json({message: 'avis retiré!'}))
                        .catch(error => res.status(400).json({error}))
                    }
                break;
                default:
                    res.status(400).json({message: 'avis hors {-1,0,1}'})
            }
        }
    })
    .catch(error => res.status(400).json({ error }));
};

