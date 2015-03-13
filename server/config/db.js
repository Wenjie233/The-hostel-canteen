'use strict';

var  mongoose = require('mongoose');

var db = mongoose.createConnection();

db.on('connected', function () {
     console.log('connected db success');
});
db.on('error', function(err) {
    //do something..
    //console.log('database error');
});
db.on('disconnected', function () {
    db.open(config.mongo.host, config.mongo.database, config.mongo.port, config.mongo.options);//百度云平台特性
});

db.open(config.mongo.host, config.mongo.database, config.mongo.port, config.mongo.options);


module.exports = db;