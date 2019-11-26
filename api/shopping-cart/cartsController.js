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
          if(cart == null){
            //add new item to shopping cart
            return Promise.resolve(createCart(body))
            .then(cart => new Promise(addToCart(cart)))
          }
          else{
            //update the quantity of an exiting item in shopping cart
          }
      })
      .then(cart => {
        res.status(201).send(cart.ops[0])
      })
      .catch(err => {
        logger.error(err)
        res.status(400).send({ messages: [err.message] })
      })
  })

  return router
}
