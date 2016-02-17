
'use strict';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const userHandler = require('./middlewares/users/usersHandler');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//register the controllers
const leagueController = require('./controllers/leaguesController');
const favoritesController = require('./controllers/favoritesController');
const usersController = require('./controllers/usersController');

app.use('/football-data', leagueController);
app.use('/favorites', favoritesController);
app.use('/user', usersController);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// authentication

app.use(require('express-session')({ resave: false, saveUninitialized: false, secret: 'mysuperbigsecret'}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(function (username, password, done)  {
  userHandler.getOne(username, function (err, users) {
    if (err)
      console.log(err.message);
    const u = users;
    if (!u)
      return done(null, false, 'Username invalid!');
    if(u.password != password)
      return done(null, false, 'Passowrd invalid!');
    return done(null, u);
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  userHandler.getOne(id, done)
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
