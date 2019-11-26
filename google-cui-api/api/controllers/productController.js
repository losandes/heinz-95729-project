'use strict';


var mongoose = require('mongoose'),
  Product = mongoose.model('Product');
  Cart = mongoose.model('Cart');

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

exports.add_an_item = function(req, res) {
  var product = Product.findOne({product_name:req.body},
    //how to get the current user, what is the syntax
  var new_item = new cart({product_name:product.product_name,product_price:product.product_price,user_name:"HI"}),
  console.log("POST REQUEST: add an item");
  new_item.save(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};
//User has to give the id
exports.delete_an_item = function(req, res) {
  Cart.remove({
    _id: req.params.cartId
  }, function(err, cart) {
    if (err)
      res.send(err);
    res.json({ message: 'Task successfully deleted' });
  });
};

//TODO
exports.list_all_carts = function(req, res) {
  console.log("GET REQUEST: listing all products");
  Product.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};
