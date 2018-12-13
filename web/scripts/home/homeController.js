module.exports = {
  scope: 'heinz',
  name: 'homeController',
  dependencies: ['router', 'homeComponent', 'Product', 'productsRepo', 'storage'],
  factory: (router, homeComponent, Product, repo, storage) => {
    'use strict'

    /**
     * Route binding (controller)
     */
    function registerRoutes (app) {
      router('/', () => {
        const user = storage.get('user')
        if (user !== null && user.categories[0] !== undefined) {
          const chosenCategory = user.categories[0]
          repo.search(chosenCategory, (err, products) => {
            if (err) {
              console.log(err)
              // TODO: render error view
            }

            app.currentView = 'loading'
            if (products && products.length) {
              homeComponent.setProducts(new ProductSearchResult(products, chosenCategory))
            } else {
              // TODO: route to a "none found" page
              homeComponent.setProducts(new ProductSearchResult(null))
            }
            app.currentView = 'home'
          })
        } else {
          app.currentView = 'loading'
          homeComponent.setProducts(new ProductSearchResult(null))
          app.currentView = 'home'
        }
      })
    }

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
        category
      }
    }

    return { registerRoutes }
  }
}
