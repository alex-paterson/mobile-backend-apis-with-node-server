var User = require('../models/user');
var jwt = require('jwt-simple');
var config = require('../config');

function tokenForUser(user) {
  return jwt.encode({
    sub: user._id,
    iat: new Date().getTime()
  }, config.secret);
}

exports.signup = function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  var user = new User ({
    email: email,
    password: password
  });

  user.save(function(err) {
    if (err) {
      if (err.errors && err.errors.email) {
        return res.status(422).json({error: err.errors.email.message});
      }
      if (err.errors && err.errors.password) {
        return res.status(422).json({error: err.errors.password.message});
      }
      return next(err);
    }
    res.json({token: tokenForUser(user), userId: user._id});
  });

}

exports.signin = function(req, res, next) {
  res.json({token: tokenForUser(req.user), userId: req.user._id, todos: req.user.todos});
}
