'use strict';


var mongoose = require('mongoose'),
  Product = mongoose.model('Product');
 

exports.list_all_products = function(req, res) {
  console.log("GET REQUEST: listing all products");
  Product.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};



//Why we need this?
exports.create_a_product = function(req, res) {
  var new_product = new Product(req.body);
  console.log("POST REQUEST: create a product");
  new_product.save(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.readTtemDetail = function(req, res) {
  //findById needs to be changed
  Product.findOne({product_name:req.body}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};



