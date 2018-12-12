module.exports = {
  scope: 'heinz',
  name: 'homeController',
  dependencies: ['router', 'productsComponent', 'Product', 'productsRepo', 'storage'],
  factory: (router, productsComponent, Product, repo, storage) => {
    'use strict'

    /**
     * Route binding (controller)
     */
    function registerRoutes (app) {
      // router('/', () => {
      //   app.currentView = 'home'
      // })

      router('/', () => {
        // let user = storage.get('user')
        repo.search('love', (err, products) => {
          if (err) {
            console.log(err)
            // TODO: render error view
          }

          if (products && products.length) {
            productsComponent.setProducts(new ProductSearchResult(products))
            app.currentView = 'products'
          } else {
            // TODO: route to a "none found" page
            router.navigate('/')
          }
        })
      })
    }

    /**
     * A view model for the search results (an array of products)
     * @param {Array} products - the products that were returned by the result
     */
    function ProductSearchResult (products) {
      if (!Array.isArray(products)) {
        return {
          products: []
        }
      }

      return {
        products: products.map(product => new Product(product))
      }
    }

    return { registerRoutes }
  }
}
