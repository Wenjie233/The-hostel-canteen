'use strict';

exports.checkLogin = function (req, res, next){
	if(!req.session.login) {
		res.redirect('/admin/login');
	}
	return next();
}

exports.checkLogout = function (req, res, next){
	if(req.session.login) {
		res.redirect('/admin/orders');
	}
	return next();
}