module.exports = {
  scope: 'heinz',
  name: 'stripeController',
  dependencies: ['router'],
  factory: (router) => {
    'use strict'

    /**
     * Route binding (controller)
     */
    function registerRoutes (app) {
      router('/stripe', () => {
        app.currentView = 'stripe'
      })
      // //Route for error page
      // router('/error', () => {
      //   app.currentView = 'error'
      // })
    }

    return { registerRoutes }
  }
}