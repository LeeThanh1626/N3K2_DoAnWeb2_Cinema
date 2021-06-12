const { promisify } = require('util');
const asyncHandler = require('express-async-handler');
const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const router = express.Router();

//code get, post here
//Login, register, logout for admin and user
router.get('/login', function(req, res) {
    //xử lý

    res.render('user/login')
});

router.get('/signup', function(req, res) {
    //xử lý

    res.render('user/signup')
});

module.exports = router;