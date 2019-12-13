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
  console.log("GET REQUEST: readItemDetail");
  console.log("request as follow");
  console.log(req.params);
  Product.findOne({product_name:(req.params.product_name.toLowerCase())}, function(err, task) {
    if (err)
      res.send(err);
    if (task == null) {
      res.json({error: "product not in database", message: "We are not selling this, please start from beginning, saying what do you want to buy"});
      // res.send("We are not selling this, please start from beginning, saying what do you want to buy");
      return;
    }
    console.log(task);
    res.json(task.product_price);
  });
};




