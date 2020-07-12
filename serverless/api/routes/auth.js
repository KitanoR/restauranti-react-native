const express = require('express');
const crypto = require('crypto');
const Users = require('../models/Users');
const jwt = require('jsonwebtoken');
const { isAuthenticated } = require('../auth');

const router = express.Router();

const singToken = (_id) => {
    return jwt.sign({_id}, 'my-secret', {
        expiresIn: 60 * 60 * 24 * 365,
    });
}

router.post('/register', (req, res) => {
    const { email, password } = req.body;
    crypto.randomBytes(16, (err, salt) => {
        const newSalt = salt.toString('base64');
        crypto.pbkdf2(password, newSalt, 5000, 64, 'sha1', (err, key) => {
            const encryptedPassword = key.toString('base64');
            Users.findOne({ email }).exec()
                .then( user => {
                    if (user) {
                        return res.send('usuario ya existe')
                    }
                    Users.create({
                        email,
                        password: encryptedPassword,
                        salt: newSalt
                    }).then(() => {
                        res.send('Usuario creado con exito')
                    })
                })
        } );
    });
 });
 
 router.post('/login', (req, res) => {
    const { email, password } = req.body;
    Users.findOne({ email }).exec()
        .then( user  => {
            if(!user){
                return res.send('Usuario y/o contraseña incorrecta')
            }
            crypto.pbkdf2(password, user.salt, 5000, 64, 'sha1', (err, key) => {
                const encryptedPassword = key.toString('base64');
                if(user.password === encryptedPassword){
                    const token = singToken(user._id);
                    return res.send({ token });
                } 
                return res.send('Usuario y/o contraseña incorrecta')
            })
        });
 });
 
 router.get('/me', isAuthenticated, (req, res) => {
    res.send(req.user);
 });
 module.exports = router;