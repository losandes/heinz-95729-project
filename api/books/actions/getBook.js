module.exports.name = 'getBook'
module.exports.dependencies = ['productsRepo', 'Book']
module.exports.factory = function (repo, Book) {
  'use strict'

  const getBook = (uid) => (resolve, reject) => {
    repo.get(uid)
      .then(resolve)
      .catch(reject)
  }

  const bindToBook = (doc) => (resolve, reject) => {
    return resolve(new Book(doc))
  }

  return { getBook, bindToBook }
}
