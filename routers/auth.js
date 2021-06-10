const User = require('../models/user');
const express = require('express');
// const { promisify } = require('util');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const router = express.Router();
router.use(function (req, res, next) {
    res.locals.title = 'Đăng nhập';
    next();
});
router.get('/login', function (req, res) {
    // res.locals.title = 'Đăng nhập';
    res.render('auth/login');
});
// c3
//
router.post('/login', function (req, res,next) {
    //lên session lấy về email và pass đã nhập
    const { emailsv, passwordsv } = req.body;
    // const found = User.findbyEmail(emailsv);
     User.findbyEmail(emailsv).then(function(found)
     {

        
        if (found && bcrypt.compareSync(passwordsv,found.password)&& found.code === null) 
        {
    
                // c2
                // res.locals.title='Đăng nhập';
                req.session.userId = found.id;
                res.redirect('/');
            }
            else {
                res.render('auth/login');
            }
     }).catch(next);
    // if (found && found.password === passwordsv) {

    //     // c2
    //     // res.locals.title='Đăng nhập';
    //     req.session.userId = found.id;
    //     res.redirect('/');
    // }
    // else {
    //     res.render('auth/login');
    // }


   
});

router.get('/register', function(req, res) {
    res.render('register/register',{title:'Đăng ký'});
});

router.get('/register/confirm', asyncHandler(async function(req, res) {
    const code = req.query.code;
    const id = req.query.id;
    console.log(code + "," + id);
    await User.confirm(code, id);
    res.redirect('/auth/login');
}));

router.post('/register', asyncHandler(async function(req, res) {
    const { name, email, password } = req.body;
    await User.Register(name, email, password);
    res.redirect('/auth/login');
}));

router.get('/logout', function (req, res) {

    delete req.session.userId;
    res.redirect('/');
});
module.exports = router;