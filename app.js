const express = require('express');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const cookieSession = require('cookie-session');
const app = express();
const authMiddleware = require('./middleware/auth');
const db = require('./models/db');

const indexRouter = require('./routers/index');
const authRouter = require('./routers/auth');
app.use(expressLayouts);

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');


app.use(cookieSession({
    name: 'session',
    keys: [ process.env.COOKIE_KEY||'secret'],
  
    
    maxAge: 24 * 60 * 60 * 1000 
  }))

  app.use(authMiddleware);
  app.use('/',indexRouter);

app.use('/auth',authRouter);


 
  db.sync().then(function(){
const port = process.env.PORT || 3006;
console.log(`Sever đang lắng nghe port ${port}`);

app.listen(port);
  }).catch(console.error);
