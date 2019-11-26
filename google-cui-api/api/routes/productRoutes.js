'use strict';
module.exports = function(app) {
  var product = require('../controllers/productController');

  // todoList Routes
  app.route('/product')
    .get(product.list_all_products)
    .post(product.create_a_product);


  app.route('/product/:product_name')
    .get(product.readTtemDetail);
    // .put(product.addToShoppingCart)
    // .delete(product.deletefromShoppingCart);
  app.route('/cart/:product_name')
    .post(cart.add_an_item)
    // .put(todoList.update_a_task)
    .delete(cart.delete_an_item);

  app.route('/cart/:user_name')
    .get(cart.list_all_carts)
};
