module.exports = {
  scope: 'heinz',
  name: 'ShoppingCart',
  factory: () => {
    'use strict'

    const cart = new ShoppingCart()

    return cart

    function ShoppingCart () {
      const products = new Set()

      return {
        products,
        addItem,
        removeItem,
        getItems,
        getSubtotal
      }

      function addItem (product) {
        products.add(product)
      }

      function removeItem (product) {
        products.delete(product)
      }

      function getItems () {
        return products
      }

      function getSubtotal () {
        const items = [...products]
        let subtotal = items.reduce((total, product) => total + product.price, 0)
        subtotal = subtotal.toFixed(2)
        return subtotal
      }
    }
  }
}
