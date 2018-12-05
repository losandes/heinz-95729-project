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
        // TODO: Remove alert later on when there is an animation
        // For now, we will use this during the demo tomorrow.
        /* eslint no-undef: "error" */
        /* eslint-env browser */
        // alert(`${product.title} added to cart!`) // eslint no-undef: "error"
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
