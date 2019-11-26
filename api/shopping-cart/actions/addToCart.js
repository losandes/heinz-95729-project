module.exports.name = 'addToCart'
module.exports.dependencies = ['cartsRepo']
module.exports.factory = function (repo) {
  'use strict'

  const validateCart = (cart) => (resolve, reject) => {
    // TODO: make sure the properties we need are here
    resolve(cart)
  }

  const addToCart = (cart) => (resolve, reject) => {
    return repo.create(cart)
      .then(resolve)
      .catch(reject)
  }

  const getCart = (uid) => (resolve, reject) => {
    return repo.get(uid)
      .then(resolve)
      .catch(reject)
  }

  const createCart = (body) => {
    var cart = {}
    cart.uid = body.uid
    cart.total = body.price * body.quantity
    cart.items = [{"name": body.name, "quantity": body.quantity, "price": body.price}]
    return cart
  }

  return { getCart, addToCart, validateCart, createCart }
}
