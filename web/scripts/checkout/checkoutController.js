module.exports = {
  scope: 'heinz',
  name: 'checkoutController',
  dependencies: ['router', 'Stripe', 'checkoutComponent', 'ShoppingCart', 'Product', 'environment'],
  factory: (router, Stripe, checkoutComponent, shoppingCart, Product, env) => {
    'use strict'

    /**
     * A view model for the products in the shopping cart (an array of products)
     * @param {Array} products - the products in shopping cart
     */
    function CartResult (shoppingCart) {
      // Spread set into array.
      const products = shoppingCart.getItems()
      const subtotal = shoppingCart.getSubtotal()
      const pubKey = env.get('stripe_pk')
      const stripe = Stripe(pubKey)

      // Rebuild objects that were stored in the local storage.
      for (let i = 0; i < products.length; i++) {
        if (!products[i].viewDetails) {
          products[i] = new Product(products[i])
        }
      }

      return {
        products,
        subtotal,
        shoppingCart,
        stripe
      }
    }

    /**
     * Route binding (controller)
     * @param {Vue} app - the main Vue instance (not the header)
     */
    function registerRoutes (app) {
      router('/checkout', (context) => {
        app.currentView = 'loading'
        checkoutComponent.setCheckout(new CartResult(shoppingCart))
        app.currentView = 'checkout'
      })

      router('/checkout-success', () => {
        app.currentView = 'checkoutSuccess'
      })
    }

    return { registerRoutes }
  }
}
