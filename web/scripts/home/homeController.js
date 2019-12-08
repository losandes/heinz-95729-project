module.exports = {
  scope: 'heinz',
  name: 'homeController',
  dependencies: ['router'],
  factory: (router) => {
    'use strict'

    /**
     * Route binding (controller)
     */
    function registerRoutes (app) {
      router('/', () => {
        app.currentView = 'home'
      })
      //Route for error page
      router('/error', () => {
        app.currentView = 'error'
      })
    }

    return { registerRoutes }
  }
}
