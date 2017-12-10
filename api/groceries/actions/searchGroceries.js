module.exports.name = 'searchGroceries'
module.exports.dependencies = ['productsRepo', 'Grocery']
module.exports.factory = function (repo, Grocery) {
  'use strict'

  const searchGroceries = (query) => (resolve, reject) => {
    repo.find({
      query: {
        $text: {
          $search: query
        },
        type: 'grocery'
      }
    }).then(resolve)
      .catch(reject)
  }

  const getGroceryByIds = (ids) => (resolve, reject) => {
    repo.getByIds({
      query: {
        uid: {
          $in: ids
        }
      }
    }).then(resolve)
      .catch(reject)
  }

  const bindToManyGroceries = (docs) => (resolve, reject) => {
    return resolve(docs.map(grocery => new Grocery(grocery)))
  }

  return { searchGroceries, bindToManyGroceries, getGroceryByIds }
}
