/*
// See the README.md for info on this module
*/
module.exports.name = 'cartRepo'
module.exports.singleton = true
module.exports.dependencies = ['db', 'Product', 'polyn']
module.exports.factory = function (db, Product, { Blueprint, is }) {
  const collection = db.collection('products')
  return new Promise((resolve, reject) => {
    const find = (query) => {
      console.log('inside cartRepo.js')
      return new Promise((resolve, reject) => {
        collection.findOne({}, function (err, result) {
          if (err) throw err
          console.log('result='.concat(result.name))
        })
      })
    }
    return {find}
  })
}
