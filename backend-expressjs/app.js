var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var employeesRouter = require('./routes/employees');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var cors = require('cors');
app.use(cors({
  origin: [
    'http://localhost:5173',
  ]
}));

app.use('/', indexRouter);
app.use('/employees', employeesRouter);

module.exports = app;
