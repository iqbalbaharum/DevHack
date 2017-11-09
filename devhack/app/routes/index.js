var express = require('express');
var passport = require('passport');

module.exports = function(app, passport) {

  // store authentication status
  app.use(function(req, res, next) {
    res.locals.login = req.isAuthenticated();
    next();
  });

    // Login
    app.get('/login', (req, res) => {
      res.render('login', {message: req.flash('loginMessage')});
    });

    app.post('/login', passport.authenticate('login', {
      successRedirect : '/meetup', // redirect to the secure profile section
      failureRedirect : '/login', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
    }));

    app.get('/logout', (req, res) => {
      req.logout();
      res.redirect("/login");
    });

    // Register
    app.get('/register', (req, res) => {
      res.render('register', {message: req.flash('registerMessage')});
    });

    app.post('/register', passport.authenticate('signup', {
      successRedirect: '/meetup',
      failureRedirect: '/register',
      failureFlash: true
    }));

    app.get('/meetup', isLoggedIn, (req, res) => {
      res.render('meetup', {user: req.user});
    });
}

// Check if the user already logged in or not
function isLoggedIn(req, res, next) {

  if(req.isAuthenticated())
    return next();

  // redirect to login page
  res.redirect('/login');
}
