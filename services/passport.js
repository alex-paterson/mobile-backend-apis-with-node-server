var passport = require('passport');

var User = require('../models/user');
var config = require('../config');
var LocalStrategy = require('passport-local');

var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;


var loginOptions = {
  usernameField: 'email'
}
var localLogin = new LocalStrategy(loginOptions, function(email, password, done) {
  User.findOne({email: email}, function(err, user) {
    if (err) { return done(err) }
    if (!user) { return done(null, false) }
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err) }
      if (!isMatch) { return done(null, false) }
      return done(null, user);
    });
  })
});

var jwtOptions = {
  secretOrKey: config.secret,
  jwtFromRequest: ExtractJwt.fromHeader('authorization')
}

var jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  User.findById(payload.sub, function(err, user) {
    if (err) { return done(err, false) }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(localLogin);
passport.use(jwtLogin);
