module.exports = {
  scope: 'heinz',
  name: 'productsController',
  dependencies: ['router', 'productsComponent', 'productComponent', 'fiveComponent', 'Product', 'productsRepo'],
  factory: (router, productsComponent, productComponent, fiveComponent, Product, repo) => {
    'use strict'

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
<<<<<<< HEAD
          if (products && products.length) { 
=======
          console.log(products)
          if (products && products.length) {
            console.log('find')
>>>>>>> 9e0b3948232bc7d6595edd95a5dd962d3e04bb96
            productsComponent.setProducts(new ProductSearchResult(products))
            app.currentView = 'products'
          } else {
            console.log('not find')
            app.currentView = 'noSearchResult'
          }
        })
      })
	  
	  
	  router('/top', (context) => {
        app.currentView = 'loading'
        repo.getFive(context,(err, products) => {
          if (err) {
            console.log(err)
            // TODO: render error view
          }
		  //console.log(products)

          if (products && products.length) {
			//console.log(products.length)
            fiveComponent.setProducts(new ProductSearchResult(products))
            app.currentView = 'Five'
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
            app.currentView = 'noSearchResult'
          }
        })
      })
    }

    return { registerRoutes }
  }
}
