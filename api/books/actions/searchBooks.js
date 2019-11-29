module.exports.name = 'searchBooks'
module.exports.dependencies = ['productsRepo', 'Book']
module.exports.factory = function (repo, Book) {
  'use strict'
  
  const searchBooks = (query) => (resolve, reject) => {
    repo.find({
      query: {
        $text: {
          $search: query
        },
        type: 'book'
      }
    }).then(resolve)
      .catch(reject)
  }

  const bindToManyBooks = (docs) => (resolve, reject) => {
    return resolve(docs.map(book => new Book(book)))
  }

  return { searchBooks, bindToManyBooks }
}
