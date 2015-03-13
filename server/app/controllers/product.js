'use strict';

var _ = require('lodash'),
    fs = require('fs'),
	Product = require('./../models/products'),
	Product_Classify = require('./../models/product_classifys');

exports.getClassifyList = function(req, res) {
	Product_Classify.find(function(err, classifys){
		if(err){ return handleError(res, err); }
		if(!classifys) { return res.sendStatus(404); }
		res.status(200).json(classifys);
	})
	/*
	Product_Classify.getClassifyList(function(err, classifys){
		if(err){ return handleError(res, err); }
		if(!classifys) { return res.send(404); }
		res.status(200).json(classifys);
	});*/
}

exports.getProductsInClassify = function(req, res) {
	Product.find({
		classifyId : req.params.classifyId
	}).exec(function(err, products){
		if(err){ return handleError(res, err);}
		if(!products){ return res.sendStatus(404);}
		res.status(200).json(products);
	});
}

//添加一个商品
exports.create = function (req, res) {
    console.log(req.body);
    console.log(req.files);
    var data = req.body;
    data.img = req.files.img.name;
    console.log(data);
    var tmp_path = req.files.img.path;
    var target_path = './client/images/' + req.files.img.name;
    fs.rename(tmp_path, target_path, function(err){
        if(err) {
            console.log('rename error'); 
            return handleError(res, err);}
        fs.unlink(tmp_path, function(err){
            
            Product.create(data, function(err, product){
                    if(err) { return handleError(res, err);}
                    return res.status(201).json(product);
            });
        })
    });
    
    
  
};

//更新一个商品
exports.update = function(req, res) {
    if(req.body._id) { delete req.body._id;}
    Product.findById(req.params.id, function(err, product){
        if(err) { return handleError(res, err); }
        if(!product) { return res.send(404); }
        var updated = _.merge(product, req.body);
        updated.save(function(err) {
            if(err) { return handleError(res, err);}
            return res.status(200).json(product);
        })
    });
}
//删除一个商品
exports.destroy = function(req, res) {
    Product.findById(req.params.id, function(err, product){
        if(err) { return handleError(res, err);}
        if(!product) { return res.send(404); }
        product.remove(function(err) {
           if(err) {return handleError(res, err);}
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.status(500).send(err);
}