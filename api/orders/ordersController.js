module.exports.name = 'ordersController'
module.exports.dependencies = ['router', 'addOrder', 'findOrders', 'addToCart', 'updateCart', 'logger']
module.exports.factory = (router, _addOrder, _findOrders, _addToCart, _updateCart, logger) => {
  'use strict'

  const { addOrder } = _addOrder
  const { getCart } = _addToCart
  const { deleteCart } = _updateCart
  const { findOrders } = _findOrders
  
  router.post('/orders/add/:uid', function (req, res) {
    var uid = req.params.uid

    Promise.resolve(req.params.uid)
      .then(uid => new Promise(getCart(uid)))
      .then(cart => new Promise(addOrder(cart)))
      //delete cart after successfully saving to orders
      .then(() => new Promise(deleteCart(uid)))
      .then(() => {
        res.status(201).send({ messages: ['Order created successfully']})
      })
      .catch(err => {
        logger.error(err)
        res.status(400).send({ messages: [err.message] })
      })
  })

  router.get('/orders/:uid', function(req, res){
    Promise.resolve(req.params.uid)
      .then(uid => new Promise(findOrders(uid)))
      .then(orders => {
        res.status(201).send(orders)
      })
      .catch(err => {
        logger.error(err)
        res.status(400).send({ messages: [err.message] })
      })
  })
  

  return router
}
