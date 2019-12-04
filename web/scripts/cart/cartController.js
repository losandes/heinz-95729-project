module.exports = {
  scope: 'heinz',
  name: 'cartController',
  dependencies: ['router'],
  factory: (router) => {
    'use strict'

    /**
     * Route binding (controller)
     */
    function registerRoutes (app) {
      router('/checkout', () => {
        app.currentView = 'checkout'
      })
    }
    return { registerRoutes }
  }
}
