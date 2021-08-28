const express = require('express');
const router = express.Router();
const catchAsync = require('../utilis/catchAsync');
const User = require('../models/user');
const users = require('../controllers/user')
const passport = require('passport')

router.get('/register', users.renderUser);

router.post('/register', catchAsync(users.registerUser))

router.get('/login', users.renderLogin)

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginUsers)

router.get('/logout', users.logoutUser)
module.exports = router;