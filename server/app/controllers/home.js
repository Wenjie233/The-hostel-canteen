'use strict';

var Classify = require('./../models/product_classifys'),
	Product = require('./../models/products'),
	Customer = require('./../models/customer'),
	OAuth = require('wechat-oauth'),
    client = new OAuth(global.config.appid, global.config.secret);

exports.index = function(req, res) {
	if(req.cookies.order) {
		console.log(req.cookies.order);
		var order = JSON.parse( decodeURIComponent(req.cookies.order) );
		console.log(order);
	} 


	Classify.find(function(err, classifys){
		if( err ){return res.status(500).send(err);}
		Product.find().exec( function(err, products){
			if(req.query.code === undefined ){
					return res.render('home/home', {
						title: '吃狸-最休闲的掌上零食',
						classifys: classifys,
					 	products: products,
					 	userInfo: {}
					});

			} else {
				client.getAccessToken(req.query.code, function(err, result){
					if(err) { return res.status(500).send(err);}
				var accessToken = result.data.access_token;
  				var openid = result.data.openid;
  				client.getUser(openid, function (err, result) {
  					if(err) { return res.status(500).send(err);}
				  	var userInfo = result;
				  	return res.render('home/home', {
						title: '吃狸-最休闲的掌上零食',
						classifys: classifys,
					 	products: products,
					 	userInfo: userInfo
					});
				});
				});

			}
		});
	})
}


exports.account = function(req, res) {
	if(req.cookies.order) {
		//console.log(req.cookies.order);
		var order = JSON.parse( decodeURIComponent(req.cookies.order) );
		console.log(order);
	} else {
		return res.redirect('/');
	}

	Customer.find({
		'wechatInfo.openid': order.wechatInfo.openid
	}).exec(function(err, customer){
		if(err){ return res.status(500).send(err);}
		console.log(customer);
		return res.render('home/account', {
			title: '吃狸-结算页面',
			customer: customer
		});
		
	});
}

exports.success = function(req, res) {
	var backURL = client.getAuthorizeURL(global.config.host, ' ', 'snsapi_userinfo');

	return res.render('home/success', {
		title: '吃狸-购买成功，欢迎下次光临 ',
		backURL: backURL
	})
}