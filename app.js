var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session=require('express-session');
//获取配置文件
var settings=require('./settings');
//初始化数据库
require('./db');
var MongoStore=require('connect-mongo')(session);
//获取路由文件
var routes = require('./routes/index');
var users = require('./routes/users');
var articles=require('./routes/articles');
var flash=require('connect-flash');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html',require('ejs').__express);

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret:settings.cookieSecret,
    resave:true,
    saveUninitialized:true,
    store:new MongoStore({
        url:settings.url
    })
}));
app.use(flash());
//设置静态服务器
app.use(express.static(path.join(__dirname, 'public')));

//设置路由
app.use(function(req,res,next){
    //res.locals
    res.locals.user=req.session.user;
    res.locals.success=req.flash('success').toString();
    res.locals.error=req.flash('error').toString();
    next();
});
app.use('/', routes);
app.use('/users', users);
app.use('/articles',articles);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
