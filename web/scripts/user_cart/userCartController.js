module.exports = {
  scope: 'heinz',
  name: 'userCartController',
  dependencies: ['router', 'storage'],
  factory: (router, storage) => {
    'use strict'

    /**
     * Route binding (controller)
     * @param {Vue} app - the main Vue instance (not the header)
     */
    function registerRoutes (app) {
      router('/userCart', () => {
        app.currentView = 'userCart'
      })
    }

    return { registerRoutes }
  },
}
