const express = require('express');
var bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const db = require('./models/db');
var cookieSession = require('cookie-session');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use(express.static('public'));

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

// app.use('/auth', authRouter);

app.get('/', function(req, res) {
    res.render('layout', { title: 'Trang chủ' });
})

db.sync().then(function() {
    const port = process.env.PORT || 3000;
    console.log(`Server is listening on port ${port}`);
    app.listen(port);
}).catch(console.error)