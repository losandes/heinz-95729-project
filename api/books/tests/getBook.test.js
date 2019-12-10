module.exports.name = 'booksController'
module.exports.dependencies = ['searchBooks', 'getBook', 'getBooks']
module.exports.factory = (_searchBooks, _getBook, _getBooks) => {
  'use strict'
  
  const { searchBooks, bindToManyBooks } = _searchBooks
  const { getBook, bindToBook } = _getBook
  const { getBooks } = _getBooks
  const { getDownloadQuantity, reduceBookDownloadQuantity } = _orderDownload

  
}
