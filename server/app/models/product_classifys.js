'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ProductClassifySchema = new Schema({
	name: String
});

ProductClassifySchema.statics = {
	getClassifyList: function( cb ) {
		 return this.find().exec( function (err, classifys){
			if(err) {
				cb(err, null);
			} else {
				cb(null, classifys);
			}
		});
	}
}

module.exports = db.model('product_classifys', ProductClassifySchema);