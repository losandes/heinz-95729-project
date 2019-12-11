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
  console.log("POST REQUEST: add an item");
  console.log(req.body);
  Product.findOne({product_name:(req.body.product_name.toLowerCase())}, function(err, task) {
    if (err)
      res.send(err);
    // res.json(task.id);
    var product_from_db = task.product_name;
    console.log(product_from_db);

    var new_item = new Cart({product_name:product_from_db})
    // console.log("POST REQUEST: add an item");
    new_item.save(function(err, task) {
      if (err)
        res.send(err);
      res.json(task);
    });
  });

    //how to get the current user, what is the syntax
  
};

exports.delete_an_item = function(req, res) {
  Cart.remove({product_name:(req.body.product_name.toLowerCase())}, function(err, cart) {
    if (err)
      res.send(err);
    res.json({ message: 'Task successfully deleted' });
  });


};


