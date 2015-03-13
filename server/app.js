'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

var express = require('express'),
    mongoose = require('mongoose');


global.config = require('./config/environment');//设置全局变量
global.db = require('./config/db.js');


console.log(process.env.NODE_ENV);
//console.log(config);




//if(config.seedDB){
//    require('./config/seed');
//}

var app = express(),
    server = require('http').createServer(app);

require('./config/express')(app);
require('./routes')(app);

server.listen(config.port, config.ip, function(){
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

exports = module.exports = app;