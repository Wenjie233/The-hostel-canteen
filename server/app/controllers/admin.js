'use strict';

var Product = require('./../models/products'),
	Order = require('./../models/orders');

exports.productList = function (req, res) {
	Product.find(function(err, products){
		if(err) { return  res.status(500).send(err); }
		return res.render('admin/products',{
			products: products
		});
	})
}

exports.orderList = function(req, res) {
	Order.find(function(err, orders){
		if(err) { return res.status(500).send(err); }
		return res.render('admin/orders',{
			orders: orders
		})
	})
}

exports.index = function(req, res){
	return res.render('admin/index');
}

exports.signin = function(req, res){
	return res.render('admin/singin', {
		
	});
}

exports.logining = function(req, res){
	if (req.body.email !== config.loginUserName || req.body.password !== config.loginPwd) {
      return res.redirect('/admin/login');
    } else {
      req.session.login = "googleauth";
      return res.redirect("/admin/index");
    }
}

exports.logouting = function(req, res){
	req.session.login=null;
	return res.redirect('login');
}
