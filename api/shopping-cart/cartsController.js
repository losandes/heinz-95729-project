module.exports.name = 'cartsController'
module.exports.dependencies = ['router', 'addToCart', 'logger']
module.exports.factory = (router, _addToCart, logger) => {
  'use strict'

  const { getCart, addToCart, validateCart, createCart } = _addToCart
  

  router.post('/carts/add', function (req, res) {
    const body = req.body

    Promise.resolve(body)
      .then(body => new Promise(validateCart(body)))
      .then(body => new Promise(getCart(body.uid)))
      .then(cart => {
        /**
         * Update Cart here
         */
        return cart
      })
     
      .then(body => {
          var cart = createCart(body)
          new Promise(addToCart(cart))
      })
      .then(response => {
        res.status(201).send(response)
      }).catch(err => {
        logger.error(err)
        res.status(400).send({ messages: [err.message] })
      })
  })

  return router
}
