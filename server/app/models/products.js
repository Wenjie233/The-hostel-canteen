
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('lodash');

var ProductSchema = new Schema({
    name : String, //名称
    img : String, //展示图片
    value : Number, //价格
    description : String, //描述
    inventory: Number,//货存
    classifyId: String //所属分类id
});
//静态方法
ProductSchema.statics = {

}

module.exports = db.model('products', ProductSchema);