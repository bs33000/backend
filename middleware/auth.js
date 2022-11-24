const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; //récup du token inclus dans req
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // decryptage avec la cle privee
        const userId = decodedToken.userId; 
        req.auth = {
            userId: userId
        };
        next();
    } catch(error) {
        res.status(401).json({ error });
    }
};