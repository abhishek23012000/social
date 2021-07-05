
const express = require('express');



const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;

const expressLayouts = require('express-ejs-layouts');

//we use the mnsgoose.js here
const db = require('./config/mongoose');
//used for session cookie
const session = require('express-session');
const passport = require('passport');
//aunthetication for local
const passportLocal = require('./config/passport-local-strategy');
const passportJWt=require('./config/passport-jwt-strategy'); 
const passportGoogle=require('./config/passport-google-oauth2-strategy');

const MongoStore = require('connect-mongo')(session);
//used for sass
const sassMiddleware = require('node-sass-middleware');
const flash=require('connect-flash');
const customMware=require('./config/middleware');
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');

app.use(sassMiddleware(
  {
      src:'./assets/scss',
      dest:'./assets/css',
      debug: true,
      outputStyle: 'extended',
      prefix: '/css',
  }
));

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static('./assets'));
app.use('/uploads',express.static(__dirname+'/uploads'));

app.use(expressLayouts);

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
app.set('case sensitive routing', false);


app.set('view engine', 'ejs');
app.set('views', './views');

/* for creating and initializing a session */
/* mongostore is used to store the session cookie in the db */
app.use(session(
  {
    name: 'codeial',
    /* ToDo: Change the secret before deployment in production mode. */
    /* whenever encryption happens, there is a key to encode and decode it that key is secret. */
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
      {
          mongooseConnection: db,
          autoRemove: 'disabled'
      },
      function (err)
      {
          console.log(err || 'connect-mongo setup is working fine');
      }
  )
  }
));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
//use expreess router
app.use(flash());
app.use(customMware.setFlash);
app.use("/", require('./routes'));

app.listen(port, (err) => {
  if (err) {
    console.log('error in running server', err);
  }

  console.log(`server is running on port: ${port}`);
});