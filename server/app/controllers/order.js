
/**
 * GET     /order              ->  index
 * POST    /order              ->  create
 * GET     /order/:id          ->  show
 * PUT     /order/:id          ->  update
 * DELETE  /order/:id          ->  destroy
 */

'use strict';

var _ = require('lodash'),
    Customer = require('./../models/customer'),
    Order = require('./../models/orders');

//获得订单列表
exports.index = function(req, res) {
    Order.find(function(err, orders){
        if(err) { return handleError(res, err);}
        if(!orders) { return res.send(404);}
        console.log(orders);
        res.status(200).json(orders); //返回状态码，json
    })
};

//获取单一订单
exports.show  = function(req, res){
    Order.findById(req.params.id, function(err, order){
        if(err) { return handleError(res, err); }
        if(!order) { return res.send(404);}

        return res.json(order);
    })
};

//添加一个订单
exports.create = function (req, res) {
    var data = req.body;
    data.state = 1;
    data.addDate = new Date();
    console.log(data);

    var customerData = {
        wechatInfo: {
            openid: data.wechatInfo.openid,
            nickname: data.wechatInfo.nickname
        },
        defaultInfo: {
            area: data.area,
            address: data.address,
            phone: data.phone,
            linkman: data.linkman
        }
    };
    console.log(customerData);

    Customer.find({
        'wechatInfo.openid': data.wechatInfo.openid
    }, function(err, customers){
        if(err) {return res.status(500).send(err)}
        if(!customers.length) {
            console.log('customer null 2222');
            Customer.create(customerData, function(err, customer){
                if(err) {return handleError(res, err);}
                Order.create(data, function(err, order){
                    if(err) { return handleError(res, err);}
                    return res.status(201).json(order);
                });
            });
        } else {
            var updated = _.merge(customers[0], customerData);
            console.log(updated);
            updated.save(function(err) {
                if(err) {return handleError(res, err);}
                Order.create(data, function(err, order){
                    if(err) { return handleError(res, err);}
                    return res.status(201).json(order);
                });
            })

        }
    });
};

//更新一个订单
exports.update = function(req, res) {
    if(req.body._id) { delete req.body._id;}
    Order.findById(req.params.id, function(err, order){
        if(err) { return handleError(res, err); }
        if(!order) { return res.send(404); }
        var updated = _.merge(order, req.body);
        updated.save(function(err) {
            if(err) { return handleError(res, err);}
            return res.status(200).json( order);
        })
    });
}

//删除一个订单
exports.destroy = function(req, res) {
    Order.findById(req.params.id, function(err, order){
        if(err) { return handleError(res, err);}
        if(!order) { return res.send(404); }
        order.remove(function(err) {
           if(err) {return handleError(res, err);}
            return res.sendStatus(204);
        });
    });
};


function handleError(res, err) {
    return res.status(500).send(err);
}

