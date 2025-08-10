const {UnauthenticatedError} = require('../errors');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Not authorized!');
    }

    const token = header.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {id: payload.id, name: payload.username};
        next();
    } catch (error) {
        throw new UnauthenticatedError('Not authorized!');
    }
}

module.exports = auth;