module.exports.name = 'getBooks'
module.exports.dependencies = ['productsRepo', 'Book']
module.exports.factory = function (repo, Book) {
  'use strict'
  
  const getBooks = () => (resolve, reject) => {
    repo.findAll().then(resolve)
      .catch(reject)
  }


  return { getBooks }
}
