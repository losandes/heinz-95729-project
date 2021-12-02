module.exports = {
  scope: 'heinz',
  name: 'cartController',
  dependencies: ['router', 'cartComponent', 'cartRepo'],
  factory: (router, cartComponent, repo) => {
    'use strict'

    /**
     * Route binding (controller)
     * @param {Vue} app - the main Vue instance (not the header)
     */
    function registerRoutes (app) {
      router('/checkout', () => {
        app.currentView = 'checkout'
      })
    }
  

    return { registerRoutes }
  },
}
