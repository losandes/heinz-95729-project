module.exports.name = 'booksController'
module.exports.dependencies = ['router', 'searchBooks', 'getBook', 'getBooks']
module.exports.factory = (router, _searchBooks, _getBook, _getBooks) => {
  'use strict'

  const { searchBooks, bindToManyBooks } = _searchBooks
  const { getBook, bindToBook } = _getBook
  const { getBooks } = _getBooks

  router.get('/books/all', function(req, res){
    Promise.resolve(req)
    .then(() => new Promise(getBooks()))
    .then(docs => new Promise(bindToManyBooks(docs)))
    .then(books => {
      res.send(books)
    }).catch(err => {
      console.log(err)
      res.status(400).send({messages: [err.message]})
    })
  })

  router.get('/books', function (req, res) {
    Promise.resolve(req.query.q)
      .then(query => new Promise(searchBooks(query)))
      .then(docs => new Promise(bindToManyBooks(docs)))
      .then(books => {
        res.send(books)
      }).catch(err => {
        console.log(err)
        res.status(400).send({ messages: [err.message] })
      })
  })

  router.get('/books/:uid', function (req, res) {
    Promise.resolve(req.params.uid)
      .then(query => new Promise(getBook(query)))
      .then(docs => new Promise(bindToBook(docs)))
      .then(book => {
        res.send(book)
      }).catch(err => {
        console.log(err)
        res.status(400).send({ messages: [err.message] })
      })
  })

  return router
}
