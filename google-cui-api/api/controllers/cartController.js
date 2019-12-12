'use strict';


var mongoose = require('mongoose'),
Product = mongoose.model('Product'),
Cart = mongoose.model('Cart');



exports.list_all_carts = function(req, res) {
  console.log("GET REQUEST: listing all carts");
  Cart.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
    // res.json({ message: 'Everything in the cart deleted' });
  });
};

exports.add_an_item = function(req, res) {
  console.log("POST REQUEST: add an item");
  console.log(req.body);
  Product.findOne({product_name:(req.body.product_name.toLowerCase())}, function(err, task) {
    if (err)
      res.send(err);
    // res.json(task.id);
    console.log(task);
    console.log(req.body.unit_number);
    var product_from_db = task.product_name;
    var unit = parseInt(req.body.unit_number);
  
    // console.log(product_from_db);
// 
    var new_item = new Cart({product_name:product_from_db,unit_number:unit})
    // console.log("POST REQUEST: add an item");
    new_item.save(function(err, task) {
      if (err)
        res.send(err);
      res.json(task);
    });
  });

    //how to get the current user, what is the syntax
  
};



//User has to give the id
exports.delete_an_item = function(req, res) {
  console.log("DELETE REQUEST: delete one selected product");
  Cart.deleteOne({product_name:(req.body.product_name.toLowerCase())}, function(err, cart) {
    if (err)
      res.send(err);
    res.json({ message: 'Task successfully deleted' });
  });
};

//TODO ？
exports.list_user_carts = function(req, res) {
  console.log("GET REQUEST: listing all products");
  Cart.findOne({_name:req.body},function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

//User has to give the id
exports.delete_all_cart = function(req, res) {
  console.log("DELETE REQUEST: delete everything in the cart");
  Cart.deleteMany({}, function(err, cart) {
    if (err)
      res.send(err);
    res.json({ message: 'Everything in the cart deleted' });
  });
};