module.exports.name = 'getFive'
module.exports.dependencies = ['productsRepo', 'Product']
module.exports.factory = function (repo, Product) {
  'use strict'

  const getFive = (query) => (resolve, reject) => {
    repo.getFive({
      query: {
        $text: {
          $search: ''
        }
      }
    })
	.then(resolve)
      .catch(reject)
  }

  const bindToManyProductss = (docs) => (resolve, reject) => {
    return resolve(docs.map(product => new Product(product)))
  }

  return { getFive, bindToManyProductss }
}
