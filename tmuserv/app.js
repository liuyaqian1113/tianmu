var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
// var socket = require('./routes/socket');
var api = require('./routes/api');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
/*
app.engine('.html', ejs.__express);
app.set('view engine', 'html');*/
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'website')));
var session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
/********登录 控制*********/
var loginFilter = require('./service/uuapLogin');
// 登录控制
app.use('*', loginFilter);
var userLogin = require('./service/userLogin');
//获取用户信息
app.use('/login', userLogin);
// 退出
var logout = require('./service/logout.js');
app.use('/logout', function (req, res, next) {
    console.log(`sessionID:${req.sessionID}`);
    req.session.destroy(function () {
        next();
    });
});
app.use('/logout', logout);
app.use('/', index);
//app.use('/socket', socket);
app.use('/api', api);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
//加载运行socket.io服务
app.createSocketIO = function (server) {
    socket.createSocketIO(server);
};
module.exports = app;

