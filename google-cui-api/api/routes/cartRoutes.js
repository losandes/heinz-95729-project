'use strict';
module.exports = function(app) {
  
  var cart = require('../controllers/cartController');
  // todoList Routes
 
  app.route('/cart')
   .post(cart.add_an_item)
    .get(cart.list_all_carts)
    // .put(todoList.update_a_task)
     .delete(cart.delete_an_item);

}
