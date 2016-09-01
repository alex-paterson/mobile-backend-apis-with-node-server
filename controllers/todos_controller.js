var User = require('../models/user');
var s3 = require('../services/s3');

exports.create = function(req, res, next) {
  // Although we post to users/:user_id/todos/new
  // this will only ever create a new todo for the current, authenticated user.
  var user = req.user;
  var text = req.body.text;
  var imagePresent = req.body.imagePresent;
  var count = user.todos.push({
    text: text
  });
  var _id = user.todos[count-1]._id;

  if (imagePresent) {
    s3.getSignedImageUploadURL(function(err, data_url) {
      if (err) { return next(err) }
      else {
        var imageURL = data_url.split("?")[0];
        user.todos.id(_id).imageURL = imageURL;
        user.save(function(err) {
          if (err) { return next(err) }
          return res.json({text: text, id: _id, postURL: data_url, getURL: imageURL});
        });
      }
    });
  } else {
    user.save(function(err) {
      if (err) { return next(err) }
      return res.json({text: text, id: _id});
    });
  }

}

exports.index = function(req, res, next) {
  res.json({todos: req.user.todos});
}

exports.destroy = function(req, res, next) {
  var user = req.user;
  var id = req.params.todo_id;
  user.todos = user.todos.filter((todo) => {
    if (todo._id == id) {
      return false
    } else {
      return true
    }
  });
  user.save(function(err) {
    if (err) { return next(err) }
    res.status(200).json({success: "Successfully destroyed todo."});
  });
}

exports.checkValidUser = function(req, res, next) {
  var user = req.user;
  if (user._id != req.params.user_id) {
    return res.status(401).json({error: "Posting to wrong user!"});
  }
  next();
}
