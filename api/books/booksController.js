module.exports.name = 'booksController'
module.exports.dependencies = ['router', 'searchBooks', 'getBook', 'getBooks', 'orderDownload']
module.exports.factory = (router, _searchBooks, _getBook, _getBooks, _orderDownload) => {
  'use strict'
 
  const { searchBooks, bindToManyBooks } = _searchBooks
  const { getBook, bindToBook } = _getBook
  const { getBooks } = _getBooks
  const { getDownloadQuantity, reduceBookDownloadQuantity } = _orderDownload

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

  router.get('/books/download/:uid/:order_id', function (req, res) {
    var order_id = req.params.order_id
    var uid = req.params.uid
  
    Promise.resolve(req.params.uid)
      .then(query => new Promise(getBook(query)))
      .then(doc => new Promise(bindToBook(doc)))
      .then(book => {
        
        return Promise.resolve(getDownloadQuantity(order_id, uid))
          .then(remainingDownload => {
            console.log("Remaining ", remainingDownload)
            console.log(remainingDownload > 0)
              if (remainingDownload > 0){
                
                return new Promise(reduceBookDownloadQuantity(order_id, uid))
                  .then(() => {
                    return res.download(book.downloadLink)
                  })
              }
              else{
                return res.send({ messages: ["You have exhausted your download"] })
              }
          })
      }).catch(err => {
        console.log(err)
        res.status(400).send({ messages: [err.message] })
      })
  })

  return router
}
