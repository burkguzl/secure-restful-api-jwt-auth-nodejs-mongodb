const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    console.log(req.header('Authorization'));
    const token = req.header('Authorization').replace('Bearer ', '');
    const data = jwt.verify(token, process.env.JWT_KEY);
    try {
        const user = await User.findOne({ _id: data._id, 'tokens.token': token });
        if (!user) {
            throw new Error('Unauthorize');
        }
        else {
            req.user = user,
                req.token = token
            next();
        }
    } catch (err) {
        res.status(400).send({ error: err });
    }
}

module.exports = auth;