module.exports = {
  scope: 'heinz',
  name: 'homeController',
  dependencies: ['router'],
  factory: (router) => {
    'use strict'

    /**
     * A view model for the search results (an array of products)
     * @param {Array} products - the products that were returned by the result
     */
    function ProductSearchResult (products, category) {
      if (!Array.isArray(products)) {
        return {
          products: []
        }
      }

      return {
        products: products.map(product => new Product(product)),
        category: capitalizeFirstLetter(category)
      }
    }

    function capitalizeFirstLetter (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }

    /**
     * Route binding (controller)
     */
    function registerRoutes (app) {
      router('/', () => {

        const user = storage.get('user')
        // If user is logged in, and they have at least 1 favorite category.
        if (user !== null && user.categories[0] !== undefined) {
          const chosenCategory = user.categories[0]
          repo.search(chosenCategory, (err, products) => {
            if (err) {
              console.log(err)
              // TODO: render error view
            }
            app.currentView = 'loading'
            homeComponent.setProducts(new ProductSearchResult(products, chosenCategory))
            app.currentView = 'home'
          })
        } else {
          // Handle case of user not being logged in or having no favorites.
          app.currentView = 'loading'
          homeComponent.setProducts(new ProductSearchResult(null))
          app.currentView = 'home'
        }
      })
    }

    return { registerRoutes }
  }
}
