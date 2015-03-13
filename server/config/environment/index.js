'use strict';

var path = require('path'),
    _ = require('lodash');

function requiredProcessEnv(name) {
    if(!process.env[name]) {
        throw new Error('You must set the ' + name + ' environment variable');
    }
    return process.env[name];
}

var all = {
    env: process.env.NODE_ENV,
    // Root path of server
    root: path.normalize(__dirname + '/../../..'),
    // Server port
    port: process.env.PORT || 18080,
    seedDB: false,
    secrets: {
        session: 'dingdang-secret'
    },
    userRoles:['guest', 'user', 'admin'],
    Token: 'dingdangToken',
    mongo: {
        options: {
            db: {
                safe:true
            }
        }
    },
    cookieParser: 'wenjie',
    cookieSecret: 'keyboard cat',
    host: 'http://**.com/',
    loginUserName: '123456@qq.com',
    loginPwd: '123456',
    appid: '',
    secret: ''
};

module.exports = _.merge(
    all,
    require('./' + process.env.NODE_ENV + '.js') ||{}
);
