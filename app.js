const express = require('express');
var bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const db = require('./models/db');
// const Middlewares = require('./middlewares/auth');
var cookieSession = require('cookie-session');

const adminRouter = require('./routers/admin');
const userRouter = require('./routers/user');
const authRouter = require('./routers/auth');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use(express.static('public'));

// app.use(Middlewares);

//Session
app.use(cookieSession({
    name: 'session',
    keys: [process.env.COOKIE_KEY || 'secret'],

    //Cookie Options
    maxAge: 24 * 60 * 60 * 1000,
}))

//EJS
app.set('views', './views');
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
// app.use('/assets', express.static(__dirname + '/public'));
app.use('/assets', express.static('assets'))

//Xử lý chức năng đăng nhập của cả admin và user
app.use('/auth', authRouter);
//Xử lý chức năng của admin
app.use('/admin', adminRouter);
//Xử lý chức năng của user
app.use('/', userRouter);

db.sync().then(function() {
    const port = process.env.PORT || 3000;
    console.log(`Server is listening on port ${port}`);
    app.listen(port);
}).catch(console.error)