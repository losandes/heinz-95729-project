'use strict';
module.exports = function(app) {
  var product = require('../controllers/productController');

  // todoList Routes
  app.route('/product')
    .get(product.list_all_products)
    .post(product.create_a_product);


  // app.route('/tasks/:taskId')
  //   .get(todoList.read_a_task)
  //   .put(todoList.update_a_task)
  //   .delete(todoList.delete_a_task);
};
