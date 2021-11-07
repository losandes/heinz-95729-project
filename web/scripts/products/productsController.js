module.exports = {
  scope: 'heinz',
  name: 'productsController',
  dependencies: ['router', 'productsComponent', 'productComponent', 'Product', 'productsRepo'],
  factory: (router, productsComponent, productComponent, Product, repo) => {
    'use strict'

    /**
     * A view model for the search results (an array of products)
     * @param {Array} products - the products that were returned by the result
     */
    function ProductSearchResult (products) {
      if (!Array.isArray(products)) {
        return {
          products: [],
        }
      }

      return {
        products: products.map(product => new Product(product)),
      }
    }

    /**
     * Route binding (controller)
     * @param {Vue} app - the main Vue instance (not the header)
     */
    function registerRoutes (app) {
      router('/products', (context) => {
        app.currentView = 'loading'

        repo.search(context.query.q, (err, products) => {
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

      router('/products/:uid', (context) => {
        repo.get(context.params.uid, (err, product) => {
          if (err) {
            console.log(err)
            // TODO: render error view
          }

          if (product) {
            productComponent.setProduct(new Product(product))
            app.currentView = 'product'
          } else {
            // TODO: route to a "none found" page
            router.navigate('/')
          }
        })
      })
    }

    return { registerRoutes }
  },
}
