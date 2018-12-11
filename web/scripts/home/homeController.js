module.exports = {
  scope: 'heinz',
  name: 'homeController',
  dependencies: ['router','homeComponent','productsRepo'],
  factory: (router, homeComponent,repo) => {
    'use strict'
	
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
     */ 
    function registerRoutes (app) {
	  router('/', (context) => {
        app.currentView = 'loading'
	  repo.getFive(context,(err, products) => {
          if (err) {
            console.log(err)
            // TODO: render error view
          }

          if (products && products.length) {
            homeComponent.setProducts(new ProductSearchResult(products))
            app.currentView = 'home'
	  }})
	  
    }
	)
	}

    return { registerRoutes }
}
}
