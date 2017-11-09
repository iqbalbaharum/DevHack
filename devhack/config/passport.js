
var LocalStrategy = require('passport-local').Strategy;
var Access = require('../app/models/accessModel');

module.exports = function(passport) {

  // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the access for the session
    passport.serializeUser(function(access, done) {
      done(null, access._id);
    });

    // used to deserialized the access
    passport.deserializeUser(function(id, done) {
      Access.findById(id, function(err, access) {
        done(err, access);
      });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('signup', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, email, password, done) {

      process.nextTick(function() {

        Access.findOne({ 'email' : email }, function(err, access) {

          if(err)
            return done(err);

          // Check to see if record exists
          if(access) {
            return done(null, false, req.flash('registerMessage', 'That email is already taken.'));
          } else {

            // create access
            var newAccess = new Access();

            // set the credential
            newAccess.email = email;
            newAccess.password = newAccess.generateHash(password);

            // save
            newAccess.save( function(err) {
              if(err)
                throw err;

              return done(null, newAccess);
            });
          }
        });
      });

    }));

    passport.use('login', new LocalStrategy({
        usernameField : 'email', // overwrite
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {

        Access.findOne({'email': email}, function(err, access) {

            if(err)
                return done(err);

            if(!access)
              return done(null, false, req.flash('loginMessage', 'No user found'));

            if (!access.isValidPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

            return done(null, access);
        })

    }));
};
