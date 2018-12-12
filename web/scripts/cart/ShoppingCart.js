module.exports = {
  scope: 'heinz',
  name: 'ShoppingCart',
  dependencies: ['storage'],
  factory: (storage) => {
    'use strict'

    const cart = new ShoppingCart()

    return cart

    function ShoppingCart () {
      let products = []
      products = storage.get('cartItems')
      if (products === null) {
        products = []
      }

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
        const demo = false
        if (findIndex(product) === -1) {
          products.push(product)
          saveCart()
          if (demo) { alert(`${product.title} added to cart!`) }
        } else {
          if (demo) { alert(`${product.title} is already in your cart.`) }
        }
      }

      function removeItem (product) {
        products.splice(findIndex(product), 1)
        saveCart()
      }

      function saveCart () {
        storage.set('cartItems', products)
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
