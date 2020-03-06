const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const User = require('../models/User');

router.post('/users', async (req, res, next) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (err) {
        res.status(400).send({ err });
    }
})

router.post('/users/login', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByCredintials(email, password);
        if (!user) {
            res.status(401).send({ error: 'Login failed, check authentication credentials' });
        }
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (err) {
        res.status(400).send(err);
    }
})

//user profile
router.get('/users/me', auth, async (req, res, next) => {
    res.send(req.user);
})

//logout by current token (device)
router.post('/users/me/logout', auth, async (req, res, next) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        console.log(req.user);
        await req.user.save();
        console.log(req.user);
        res.send();

    } catch (err) {
        res.status(500).send(err);
    }
})

//logout by all tokens (devices)
router.post('/users/me/logoutall', auth, async (req, res, next) => {
    console.log('DSadsdsadsadsadsad');
    try {
        req.user.tokens.splice(0, req.user.tokens.length);
        await req.user.save();
        console.log(req.user);
        res.send();
    } catch (err) {
        res.status(500).send(err);
    }
})

module.exports = router;



