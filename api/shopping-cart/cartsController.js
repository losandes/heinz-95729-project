module.exports.name = 'cartsController'
module.exports.dependencies = ['router', 'addToCart', 'addToExistingCart', 'updateCart', 'logger']
module.exports.factory = (router, _addToCart, _addToExistingCart, _updateCart, logger) => {
  'use strict'

  const { getCart, addToCart, validateCart, createCart } = _addToCart
  const { addToExistingCart, updateCartTotal } = _addToExistingCart
  const { updateCartItemQuantity, deleteCartItem, deleteCart } = _updateCart
  

  router.get('/carts/:uid', function(req, res){
    Promise.resolve(req.params.uid)
      .then(uid => new Promise(getCart(uid)))
      .then(cart => {
        res.status(201).send(cart)
      })
      .catch(err => {
        logger.error(err)
        res.status(400).send({ messages: [err.message] })
      })
  });

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
          }
          else{
            //add item to an existing cart
            return new Promise(addToExistingCart(body, cart))
          }
      })
      .then(() =>  new Promise(updateCartTotal(body.uid)))
      .then(() => new Promise(getCart(body.uid)))
      .then(cart => {
        res.status(201).send(cart)
      })
      .catch(err => {
        logger.error(err)
        res.status(400).send({ messages: [err.message] })
      })
  })


  router.put('/carts/update-quantity', function (req, res) {
    const body = req.body
    
    Promise.resolve(body)
      .then(body => new Promise(updateCartItemQuantity(body)))
      .then(() => new Promise(updateCartTotal(body.uid)))
      .then(() => new Promise(getCart(body.uid)))
      .then(cart => {
        res.status(201).send(cart)
      })
      .catch(err => {
        logger.error(err)
        res.status(400).send({ messages: [err.message] })
      })
  })

  router.post('/carts/delete-item', function (req, res) {
    const body = req.body
    
    Promise.resolve(body)
      .then(body => new Promise(deleteCartItem(body)))
      .then(() => new Promise(updateCartTotal(body.uid)))
      .then(() => new Promise(getCart(body.uid)))
      .then(cart => {
        res.status(201).send(cart)
      })
      .catch(err => {
        logger.error(err)
        res.status(400).send({ messages: [err.message] })
      })
  })

  router.delete('/carts/delete/:uid', function (req, res) {
    
    Promise.resolve(req.params.uid)
      .then((uid) => new Promise(deleteCart(uid)))
      .then(() => {
        res.status(201).send({messages: ['Cart deleted successfully']})
      })
      .catch(err => {
        logger.error(err)
        res.status(400).send({ messages: [err.message] })
      })
  })

  return router
}
