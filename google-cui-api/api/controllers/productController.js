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




exports.create_a_product = function(req, res) {
  var new_product = new Product(req.body);
  console.log("POST REQUEST: create a product");
  new_product.save(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


// exports.read_a_task = function(req, res) {
//   Task.findById(req.params.taskId, function(err, task) {
//     if (err)
//       res.send(err);
//     res.json(task);
//   });
// };


// exports.update_a_task = function(req, res) {
//   Task.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, task) {
//     if (err)
//       res.send(err);
//     res.json(task);
//   });
// };


// exports.delete_a_task = function(req, res) {


//   Task.remove({
//     _id: req.params.taskId
//   }, function(err, task) {
//     if (err)
//       res.send(err);
//     res.json({ message: 'Task successfully deleted' });
//   });
// };


