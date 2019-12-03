module.exports = {
  scope: 'heinz',
  name: 'Cart',
  dependencies: ['router', 'storage'],
  factory: (router, storage) => {
    'use strict'

    const cart = storage.get(cart)
    console.log(cart)

    // return function Cart (book) {
    //   const self = new Product(book)
    //   book = Object.assign({}, book)

    //   // Add authors to the product model
    //   self.authors = book.metadata && Array.isArray(book.metadata.authors)
    //     ? book.metadata.authors
    //     : []

    //   // override product's `viewDetails` function to redirect to books
    //   self.viewDetails = (event) => {
    //     if (self.uid) {
    //       router.navigate(`/books/${self.uid}`)
    //     }
    //   }

    //   return self
    // }
  }
}