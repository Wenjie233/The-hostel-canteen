'use strict';

var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    morgan = require('morgan'), //
    compression = require('compression'),
    bodyParser = require('body-parser'),
    methodOveride = require('method-override'),//
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    mongoStroe = require('connect-mongo')(session),
    errorHandler = require('errorhandler'), //
    passport = require('passport'),
    multiparty = require('connect-multiparty');


module.exports = function(app) {
    var env = app.get('env'); //当前用户环境变量中NODE_ENV值；

    app.set('views', config.root + '/server/app/views');
   // app.engine('html', require('ejs').renderFile);
   // app.set('view engine', 'html');
    app.set('view engine', 'ejs');
    app.use(compression());
    app.use(bodyParser.urlencoded({ extended: false}));
    app.use(bodyParser.json());
    app.use(multiparty());
    app.use(methodOveride());
    app.use(cookieParser(config.cookieSecret));
    var store =new mongoStroe({
        interval:120000,// expiration check worker run interval in millisec (default: 60000)
        mongoose_connection: global.db // <== custom connection
    });
    app.use(session({
          secret : config.cookieSecret,
          cookie : -1,
          resave : false,
          saveUninitialized: true,
          store : store
      }));
    app.use(passport.initialize());
    app.use(express.query());//微信接口

    if('production' === env) {
        app.use(favicon(path.join(config.root, 'client', 'favicon.ico')));
        app.use(express.static(path.join(config.root, 'client')));
        app.set('appPath', config.root + '/client');
        app.use(morgan('dev'));
    }

    if('development' === env) {
        app.use(require('connect-livereload')());//
        app.use(express.static(path.join(config.root, '.tmp')));
        app.use(express.static(path.join(config.root, 'client')));
        app.set('appPath', 'client');
        app.use(morgan('dev'));
        app.use(errorHandler()); // Error handler - has to be last
    }
}