module.exports.name = 'searchProducts'
module.exports.dependencies = ['productsRepo', 'Product']
module.exports.factory = function (repo, Product) {
  'use strict'

  const searchProducts = (query) => (resolve, reject) => {
    repo.find({
      query: {
        $text: {
          $search: query
        }
      }
    }).then(resolve)
      .catch(reject)
  }

  const bindToManyProducts = (docs) => (resolve, reject) => {
    return resolve(docs.map(product => new Product(product)))
  }

  return { searchProducts, bindToManyProducts }
}
