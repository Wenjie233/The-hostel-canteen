'use strict';

var errors = require('./components/errors'),
    auth = require('./app/controllers/auth');

module.exports = function(app) {
    //home
    var home = require('./app/controllers/home');
    app.get('/', home.index);
    app.get('/index', home.index);
    app.get('/account/', home.account);
    app.get('/success/', home.success);
    //wechat
    var wechat = require('./app/controllers/wechat');
    app.get('/wechat/', wechat.chat);
    app.post('/wechat/', wechat.chat);
    //order
    var order = require('./app/controllers/order');
    app.get('/order/', order.index);
    app.get('/order/:id', order.show);
    app.post('/order/', order.create);
    app.put('/order/:id', order.update);
    app.delete('/order/:id', order.destroy);
    //product
    var product = require('./app/controllers/product');
    app.get('/product/ClassifyList', product.getClassifyList);
    app.get('/product/:classifyId', product.getProductsInClassify);
    app.post('/product/', product.create);
    app.put('/product/:id', product.update);
    app.delete('/product/:id', product.destroy);
    //admin
    var admin = require('./app/controllers/admin');
    app.get('/admin/products', auth.checkLogin, admin.productList);
    app.get('/admin/orders', auth.checkLogin, admin.orderList);
    app.get('/admin/login',  auth.checkLogout, admin.signin);
    app.post('/admin/logining', admin.logining); //登入操作
    app.get('/admin/logouting', admin.logouting); //登出操作
    app.get('/admin/index', auth.checkLogin, admin.index);
    app.get('/admin/', auth.checkLogin, admin.index);
    
    app.route('/:url(api|auth|components|app|bower_components|assets|admin)/*')
        .get(errors[404]);
};