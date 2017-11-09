var express = require('express');
var mongoose = require('mongoose');
var ejs = require('ejs');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('express-flash');
var bodyParser = require('body-parser');
var passport = require('passport');

// configuration file
var ConfigDB = require('./config/database');
require('./config/passport')(passport);

// mongoose model
var accessModel = require('./app/models/accessModel');

// routes
var indexRoute = require('./app/routes/index');
var accessRoute = require('./app/routes/accessRoute');

// express object
var app = express();

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');

mongoose.Promise = global.Promise;
mongoose.connect(ConfigDB.database, {
  useMongoClient: true
});

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());
// app.use(session({ cookie: { maxAge: 60000 }}));
app.use(session({
  secret: 'hello-world',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//
// app.use('/', indexRoute);

require('./app/routes/index')(app, passport);

app.listen(port);
