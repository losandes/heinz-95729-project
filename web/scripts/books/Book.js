module.exports = {
  scope: 'heinz',
  name: 'Book',
  dependencies: ['router', 'Product'],
  factory: (router, Product) => {
    'use strict'

    return function Book (book) {
      const self = new Product(book)
      book = Object.assign({}, book)

      // Add authors to the product model
      self.authors = book.metadata && Array.isArray(book.metadata.authors)
        ? book.metadata.authors
        : []

      // override product's `viewDetails` function to redirect to books
      self.viewDetails = (event) => {
        if (self.uid) {
          router.navigate(`/books/${self.uid}`)
        }
      }

      return self
    }
  },
}
