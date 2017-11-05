module.exports.name = 'booksController'
module.exports.dependencies = ['router', 'searchBooks', 'getBook']
module.exports.factory = function (
  router,
  { searchBooks, bindToManyBooks },
  { getBook, bindToBook }
) {
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
