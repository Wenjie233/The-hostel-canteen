'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var CustomerSchema = new Schema({
	wechatInfo: {
		openid: String,
		nickname: String
	},
	defaultInfo: {
		area: String,
		address: String,
		phone: Number,
		linkman: String
	}
});

module.exports = global.db.model('customers', CustomerSchema);