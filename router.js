var express = require('express');
var passport = require('passport');

var AuthController = require('./controllers/auth_controller');
var TodosController = require('./controllers/todos_controller');
var passportService = require('./services/passport');

var requireSignin = passport.authenticate('local', {session: false});
var requireJwt = passport.authenticate('jwt', {session: false});

var router = express.Router();

router.route('/signup')
  .post(AuthController.signup);

router.route('/signin')
  .post([requireSignin, AuthController.signin]);


router.route('/users/:user_id/todos')
  .post([requireJwt, TodosController.checkValidUser, TodosController.create])
  .get([requireJwt, TodosController.checkValidUser, TodosController.index]);

router.route('/users/:user_id/todos/:todo_id')
  .delete([requireJwt, TodosController.checkValidUser, TodosController.destroy]);

module.exports = router;
