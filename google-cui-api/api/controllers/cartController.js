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
  // console.log(req.body);
  Product.findOne({product_name:(req.body.product_name.toLowerCase())}, function(err, task) {
    if (err)
      res.send(err);
    if (task == null) {
      res.send("No such item in databse");
      return;
    }
    // console.log(task);
    // console.log(req.body.unit_number);
    var product_from_db = task.product_name;
    var unit = parseInt(req.body.unit_number);
    var sub_total = unit * task.product_price;

    var query = { product_name: product_from_db },
        update = {  $inc: {unit_number : unit, sub_total : sub_total} },
        options = { upsert: true };

    // Find the document
    Cart.findOneAndUpdate(query, update, options, function(error, result) {
        if (!error) {
            // If the document doesn't exist
            if (!result) {
                // Create it
                console.log("create new cart");
                result = new Cart({product_name:product_from_db,unit_number:unit, sub_total: sub_total});
            }
            res.json(result);
        }
    });
  });

    //how to get the current user, what is the syntax
  
};







  // console.log(req.body);
  // Product.findOne({product_name:(req.body.product_name.toLowerCase())}, function(err, task) {
  //   if (err)
  //     res.send(err);
  //   // res.json(task.id);
  //   console.log(task);
  //   console.log(req.body.unit_number);
  //   var product_from_db = task.product_name;
  //   var unit = parseInt(req.body.unit_number);
  //   var sub_total = unit * task.product_price;
  //   // console.log(product_from_db);
  //   // var product_in_cart = Cart.findOne({product_name:product_from_db})

  // //   Task.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, task) {
  // //     if (err)
  // //       res.send(err);
  // //     res.json(task);
  // //   });
  // // };

  //   Cart.findOne({product_name:product_from_db},function(err, res1) {
  //     if (err)
  //     res1.send(err);
  //     if (res1 == null) {
  //       console.log(err);
  //       var new_item = new Cart({product_name:product_from_db,unit_number:unit, sub_total: sub_total});
  //       new_item.save(function(err1, task1) {
  //         if (err1)
  //           res1.send(err);
  //           console.log(task1);
           
            
  //         // res1.json(task1);
  //         // return;
  //       });
        
  //       // return;
  //     }
  //    // res1.json(task1);
  //    else {res.unit_number +=unit;
  //     console.log(res.unit_number);} 
  //     res.json({ message: 'added' });
      
  //       //  res.json();
  //       // .unit_number
  //       //  console.log(res.unit_number);
  //       //返回当前改好的？
  //   });
  // });



// function calculate_cart_price(productArray, unitArray) {
  
// }
//User has to give the id
exports.delete_all_cart = function(req, res) {
  console.log("DELETE REQUEST: delete everything in the cart");
  Cart.find({}, function(err, task) {
    if (err) {
      res.json({error: err, message: err});
      console.log("err1");
      return;
    }
    // if (task == null) {
    //   res.json({error: "Nothing in cart", message: "Nothing in cart"});
    //   // res.send("We are not selling this, please start from beginning, saying what do you want to buy");
    //   return;
    // }
    // res.json(task);
  });

  Cart.deleteMany({}, function(err, cart) {
    if (err){
      res.json({error: err, message: err});
      console.log("err2");
      return;
    }
    res.json({ message: 'Everything in the cart deleted' });
  });
};


//User has to give the id
exports.delete_an_item = function(req, res) {
  console.log("DELETE REQUEST: delete one selected product");
  Cart.deleteOne({product_name:(req.body.product_name.toLowerCase())}, function(err, cart) {
    if (err)
      res.send(err);
      if(cart.deletedCount >  0) {
    res.json({ message: 'Task successfully deleted' });}
    else {
      res.json({ message: 'Task not deleted' });
    }
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