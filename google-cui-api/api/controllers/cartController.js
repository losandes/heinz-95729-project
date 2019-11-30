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
  });
};

exports.add_an_item = function(req, res) {
  var productt = Product.findOne(req.body)
    //how to get the current user, what is the syntax
  var new_item = new Cart({product_name:productt["product_name"],product_price:productt["product_price"],user_name:"HI"})
  // console.log("POST REQUEST: add an item");
  new_item.save(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};
// Product.findOne(req.body, function(err, task) {
//   if (err)
//     res.send(err);
//   res.json(task);
// });
// };
// var new_cart = new Cart(req.body);
//   console.log("POST REQUEST: create a product");
//   new_cart.save(function(err, task) {
//     if (err)
//       res.send(err);
//     res.json(task);
//   });
// };
//User has to give the id
exports.delete_an_item = function(req, res) {
  Cart.remove(req.body, function(err, cart) {
    if (err)
      res.send(err);
    res.json({ message: 'Task successfully deleted' });
  });
};

//TODO
exports.list_user_carts = function(req, res) {
  console.log("GET REQUEST: listing all products");
  Cart.findOne({_name:req.body},function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};
