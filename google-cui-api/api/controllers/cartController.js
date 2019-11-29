'use strict';


var mongoose = require('mongoose'),
Product = mongoose.model('Product');
  Cart = mongoose.model('Cart');




exports.add_an_item = function(req, res) {
  var product = Product.findOne({product_name:req.body})
    //how to get the current user, what is the syntax
  var new_item = new Cart({product_name:product.product_name,product_price:product.product_price,user_name:"HI"})
  // console.log("POST REQUEST: add an item");
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
  Cart.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};
