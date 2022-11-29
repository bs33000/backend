const sanitize = require('mongo-sanitize');

module.exports = (req, res, next) => {
    try {
        req.params = sanitize(req.params);
        next();
    } catch(error) {
        res.status(500).json({ error });
    }
};