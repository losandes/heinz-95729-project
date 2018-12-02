module.exports = {
  scope: 'heinz',
  name: 'checkoutController',
  dependencies: ['router', 'checkoutComponent', 'ShoppingCart'],
  factory: (router, checkoutComponent, shoppingCart) => {
    'use strict'

    /**
     * A view model for the search results (an array of products)
     * @param {Array} products - the products that were returned by the result
     */
    function CartResult (shoppingCart) {
      // TODO: Handle case when shopping cart is empty. May need to be done in the component.

      const products = [...shoppingCart.getItems()]
      const subtotal = shoppingCart.getSubtotal()

      return {
        products,
        subtotal,
        shoppingCart
      }
    }

    /**
     * Route binding (controller)
     * @param {Vue} app - the main Vue instance (not the header)
     */
    function registerRoutes (app) {
      router('/checkout', (context) => {
        app.currentView = 'loading'
        checkoutComponent.setCart(new CartResult(shoppingCart))
        app.currentView = 'checkout'
      })
    }

    return { registerRoutes }
  }
}
