module.exports = {
  scope: 'heinz',
  name: 'ShoppingCart',
  factory: () => {
    'use strict'

    const cart = new ShoppingCart()

    return cart

    function ShoppingCart () {
      const products = []

      return {
        products,
        addItem,
        removeItem,
        getItems,
        getSubtotal
      }

      function addItem (product) {
        // TODO: Remove alert later on when there is an animation. Alert is undefined in testing.
        // For now, we will use this during the demo tomorrow.
        /* eslint no-undef: "error" */
        /* eslint-env browser */
        if (findIndex(product) === -1) {
          products.push(product)
          // alert(`${product.title} added to cart!`)
        } else {
          // alert(`${product.title} is already in your cart.`)
        }
      }

      function removeItem (product) {
        products.splice(findIndex(product), 1)
      }

      function getItems () {
        return products
      }

      function getSubtotal () {
        let subtotal = products.reduce((total, product) => total + product.price, 0)
        subtotal = subtotal.toFixed(2)
        return subtotal
      }

      function findIndex (product) {
        let idx = -1

        for (let i = 0; i < products.length; i++) {
          if (products[i].uid === product.uid) {
            idx = i
          }
        }

        return idx
      }
    }
  }
}
