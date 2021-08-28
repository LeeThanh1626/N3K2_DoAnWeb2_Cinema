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

//Quên mật khẩu
router.get('/forgetPass', function(req, res) {
    res.render('auth/forgetPass');
})
router.post('/forgetPass', asyncHandler(async function(req, res) {
    const { email } = req.body;
    const result = await User.forgotPass(email);
    res.redirect('/auth/login?result=4');
}))
router.get('/resetPass/confirmPass', asyncHandler(async function(req, res) {
    const code = req.query.code;
    const id = req.query.id;
    console.log(code + "," + id);
    await User.confirmPass(code, id);
    res.render('auth/changePass', { id });
}))
router.post('/resetPass/confirmPass', asyncHandler(async function(req, res) {
    const { password } = req.body;
    const id = req.query.id;

    const bcrypt = require('bcrypt');
    const hash = bcrypt.hashSync(password, 10);
    const pf = await User.findByPk(id);
    pf.password = hash;
    await pf.save();
    res.redirect('/auth/login?result=5');
}))

module.exports = router;