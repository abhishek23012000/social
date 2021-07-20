
const express = require('express');
const env = require('./config/environment');  
const logger=require('morgan');

const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 8000;

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
 const portchat=process.env.PORT || 5000;
chatServer.listen(`${portchat}`);
console.log('chat server is listening on port 5000');

const path = require('path');

if(env.name=='development')
{
app.use(sassMiddleware({
    src: path.join(__dirname, env.asset_path, 'scss'),
    dest: path.join(__dirname, env.asset_path, 'css'),
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));
}

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static('./assets'));
app.use('/uploads',express.static(__dirname+'/uploads'));
app.use(logger(env.morgan.mode,env.morgan.options))
app.use(expressLayouts);

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
app.set('case sensitive routing', false);


app.set('view engine', 'ejs');
app.set('views', './views');

/* for creating and initializing a session */
/* mongostore is used to store the session cookie in the db */
app.use(session({
  name: 'codeial',
  // TODO change the secret before deployment in production mode
  secret: env.session_cookie_key,
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
      function(err){
          console.log(err ||  'connect-mongodb setup ok');
      }
  )
}));

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