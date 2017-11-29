module.exports.name = 'getGrocery'
module.exports.dependencies = ['productsRepo', 'Grocery']
module.exports.factory = function (repo, Grocery) {
  'use strict'

  const getGrocery = (uid) => (resolve, reject) => {
    repo.get(uid)
      .then(resolve)
      .catch(reject)
  }

  const bindToGrocery = (doc) => (resolve, reject) => {
    return resolve(new Grocery(doc))
  }

  return { getGrocery, bindToGrocery }
}