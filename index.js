var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');

var router = require('./router');

mongoose.connect('mongodb://localhost:todolist/todolist')
var app = express();

app.use(morgan('combined'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/v1', router);

var port = process.env.PORT || 3000;
var host = process.env.HOST || '127.0.0.1';

console.log("Listening on", host, port);
app.listen(port, host);
