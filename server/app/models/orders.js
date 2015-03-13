
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('lodash');

var OrderSchema = new Schema({

    products:[{
      id : String,
      name : String,
      count : Number,
      value : Number
    }],
    valueSum : Number,//物品总价
    countSum : Number, //物品数量
    freight: Number,//运费
    allValueSum: Number, //订单总价

    wechatInfo : {
      openid : String,
      nickname : String,
    },
    
    addDate : Date, //添加日期
    state : Number,//1为已下单 2为已付款 3为已送达 
    address : String, //送货地址
    area : String, //送货区域
    remarks : String, //备注
    phone : Number, //联系电话
    linkman: String //联系人
});
//静态方法
OrderSchema.statics = {
  addOrder: function(data, callback) {
    var order = new this();
    order = _.merge(order, data);
    console.log(order);
    order.save(function(err){
                if(err) {
                  console.log(err);
                    callback('fault');
                } else {
                    callback('success');
                }

      })
  }

}

module.exports = db.model('orders', OrderSchema);

