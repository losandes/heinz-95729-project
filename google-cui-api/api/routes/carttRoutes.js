'use strict';
module.exports = function(app) {
  
  var cart = require('../controllers/cartController');
  // todoList Routes
 
  app.route('/cart/:product_name')
    .post(cart.add_an_item)
    // .put(todoList.update_a_task)
    .delete(cart.delete_an_item);

  app.route('/cart/:user_name')
    .get(cart.list_all_carts)
};
