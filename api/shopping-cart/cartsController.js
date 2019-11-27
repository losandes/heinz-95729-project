module.exports.name = 'cartsController'
module.exports.dependencies = ['router', 'addToCart', 'addToExistingCart', 'logger']
module.exports.factory = (router, _addToCart, _addToExistingCart, logger) => {
  'use strict'

  const { getCart, addToCart, validateCart, createCart, bindToCart } = _addToCart
  const { addToExistingCart, updateCartTotal, bindUpdateToCart } = _addToExistingCart
  
  router.post('/carts/add', function (req, res) {
    const body = req.body
    Promise.resolve(body)
      .then(body => new Promise(validateCart(body)))
      .then(body => new Promise(getCart(body.uid)))
      .then(cart => {
          if(cart == null){
            //create new cart and add item
            return Promise.resolve(createCart(body))
            .then(cart => new Promise(addToCart(cart)))
            .then(cart => new Promise(bindToCart(cart)))
          }
          else{
            //add item to an existing cart
            return new Promise(addToExistingCart(body, cart))
            .then(cart => new Promise(bindUpdateToCart(cart)))
            .then(cart => new Promise(updateCartTotal(cart, body)))
            .then(cart => new Promise(bindUpdateToCart(cart)))
          }
      })
      .then(() => new Promise(getCart(body.uid)))
      .then(cart => {
        res.status(201).send(cart)
      })
      .catch(err => {
        logger.error(err)
        res.status(400).send({ messages: [err.message] })
      })
  })


  router.post('/carts/update-quantity', function (req, res) {
    const body = req.body
    Promise.resolve(body)
      .then(body => new Promise(getCart(body.uid)))
      .then(cart => {
        res.status(201).send(cart)
      })
      .catch(err => {
        logger.error(err)
        res.status(400).send({ messages: [err.message] })
      })
  })

  return router
}
