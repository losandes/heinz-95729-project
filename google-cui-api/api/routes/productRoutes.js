'use strict';
module.exports = function(app) {
  var product = require('../controllers/productController');

  // todoList Routes
  app.route('/product')
    .get(product.list_all_products)
    .post(product.create_a_product);


  app.route('/product/:product_name')
    .get(product.readTtemDetail);


};
