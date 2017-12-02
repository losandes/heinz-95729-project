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
        console.log("Products in Cart Currently: " + localStorage.getItem("productsInCart"))
      })
    }

    return { registerRoutes }
  }
}
