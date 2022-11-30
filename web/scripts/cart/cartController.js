module.exports = {
  scope: 'heinz',
  name: 'cartController',
  dependencies: ['router', 'cartComponent', 'cartRepo'],
  factory: (router, cartComponent, cartRepo) => {
    'use strict'

    // we save all added products here after querying the database
    let state = {
      addedProducts: {}
    };
    /**
     * Route binding (controller)
     * @param {Vue} app - the main Vue instance (not the header)
     */
    function registerRoutes (app) {
      router('/checkout', () => {
        console.log("API call!")
        app.currentView = 'cart'
      })
    }

    return { registerRoutes }
  },
}
