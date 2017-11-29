module.exports = {
  scope: 'heinz',
  name: 'Grocery',
  dependencies: ['router', 'Product'],
  factory: (router, Product) => {
    'use strict'

    return function Grocery (grocery) {
      const self = new Product(grocery)
      grocery = Object.assign({}, grocery)

      // Add authors to the product model
      self.categories = grocery.metadata && Array.isArray(grocery.metadata.categories)
        ? grocery.metadata.categories
        : []

      // override product's `viewDetails` function to redirect to books
      self.viewDetails = (event) => {
        if (self.uid) {
          router.navigate(`/groceries/${self.uid}`)
        }
      }

      return self
    }
  }
}
