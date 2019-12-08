module.exports = [
  require('./Order.js'),
  require('./ordersRepo.js'),
  require('../shopping-cart/actions/addToCart.js'),
  require('../shopping-cart/actions/updateCart.js'),
  require('./actions/addOrder.js'),
  require('./actions/findOrders.js'),
  require('./actions/sendEMail'),
  require('./ordersController.js'),
  require('../users/actions/getUser')
]
