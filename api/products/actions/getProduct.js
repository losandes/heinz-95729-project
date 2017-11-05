module.exports.name = 'getProduct'
module.exports.dependencies = ['productsRepo', 'Product']
module.exports.factory = function (repo, Product) {
  'use strict'

  const getProduct = (uid) => (resolve, reject) => {
    repo.get(uid)
      .then(resolve)
      .catch(reject)
  }

  const bindToProduct = (doc) => (resolve, reject) => {
    return resolve(new Product(doc))
  }

  return { getProduct, bindToProduct }
}
