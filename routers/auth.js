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
    const result = req.query.result;
    res.render('auth/login', { result });
});
router.post('/login', asyncHandler(async function(req, res) {
    const { email, password } = req.body;
    const found = await User.findByEmail(email);
    if (found && bcrypt.compareSync(password, found.password) && found.code === null) {
        req.session.userId = found.id;
        res.redirect('/');
    } else {
        res.redirect('/auth/login');
    }
}))

//Đăng ký
router.get('/signup', function(req, res) {
    //xử lý
    res.render('auth/signup')
});
router.post('/signup', asyncHandler(async function(req, res) {
    const { email, password, displayName, phoneNumber } = req.body;
    const result = await User.Register(email, password, displayName, phoneNumber);
    res.redirect('/auth/login?result=' + result);
}))
router.get('/signup/confirm', asyncHandler(async function(req, res) {
    const code = req.query.code;
    const id = req.query.id;
    console.log(code + "," + id);
    await User.confirm(code, id);
    res.redirect('/auth/login');
}))

//Đăng xuất
router.get('/logout', function(req, res) {
    delete req.session.userId;
    res.redirect('/');
})

module.exports = router;