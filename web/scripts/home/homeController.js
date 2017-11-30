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
        sessionStorage.setItem("totalPrice", 0)
        sessionStorage.setItem("productsInCart", [])
        var productsInCart = sessionStorage.getItem("productsInCart")
        var totalPrice = sessionStorage.getItem("totalPrice")
        console.log("Products in Cart Currently: " + productsInCart.toString())
        console.log("Total Price of Items in Cart: " + totalPrice.toString())
      })
    }

    return { registerRoutes }
  }
}
