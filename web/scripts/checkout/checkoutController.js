module.exports = {
  scope: 'heinz',
  name: 'checkoutController',
  dependencies: ['router'],
  factory: (router) => {
    'use strict'

    /**
     * Route binding (controller)
     */
    function registerRoutes (app) {
      router('/checkout', () => {
        app.currentView = 'checkout'
        console.log("Products in Cart Currently: " + localStorage.getItem("productsInCart"))
      })
    }

    return { registerRoutes }
  }
}
