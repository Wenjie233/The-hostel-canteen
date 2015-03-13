'use strict';

module.exports = {
    // Server IP
    ip:       process.env.OPENSHIFT_NODEJS_IP ||
    process.env.IP ||
    undefined,

    // Server port
    port:     process.env.OPENSHIFT_NODEJS_PORT ||
    process.env.PORT ||
    18080,

    // MongoDB connection options
    mongo: {
        uri:    process.env.MONGOLAB_URI ||
        process.env.MONGOHQ_URL ||
        process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME ||
        'mongodb://localhost/dingdangb',
        host: 'mongo.duapp.com',
        database: 'ukugsHSpoVADtkukYRQc',
        port: 8908,
        options: {
            server: {poolSize: 5},
            user: '5B9ZNE61ChYNDNrVF7N3sNgc',
            pass: 'dScmdUMBoB5iIROck6sRW51AsTsDpc2X'
        }
    }
}