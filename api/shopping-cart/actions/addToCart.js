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

  return { addToCart, validateCart }
}
