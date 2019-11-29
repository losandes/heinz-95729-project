module.exports.name = 'addToCart'
module.exports.dependencies = ['cartsRepo', 'Cart']
module.exports.factory = function (repo, Cart) {
  'use strict'

  const validateCart = (cart) => (resolve, reject) => {
    resolve(cart)
  }

  /**
   * Custom validation method to validate a shopping cart
   * @param {Object} cart 
   */
  const validateCartItem = (cart) => {
    var item = cart.items[0]
    if (item.name === undefined || typeof item.name !== "string"
      || item.quantity === undefined || typeof item.quantity !== "number"
      || item.price === undefined || typeof item.price !== "number" 
      || item.item_uid === undefined || typeof item.item_uid !== "string"){
        throw new Error('Invalid Cart Item')
      }
      return cart
  }

  const bindToCart = (doc) => (resolve, reject) => {
    return resolve(doc.ops[0])
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
    var total = body.price * body.quantity
    cart.total = parseFloat(total.toFixed(2))
    cart.items = [{"name": body.name, "quantity": body.quantity, "price": body.price, "item_uid": body.item_uid}]
  
    return cart
  }

  return { getCart, addToCart, validateCart, createCart, validateCartItem }
}
