module.exports = {
  scope: 'heinz',
  name: 'cartController',
  dependencies: ['router', 'CartProduct', 'cartRepo', 'cartComponent', 'Cart', 'storage'],
  factory: (router, CartProduct, repo, cartComponent, Cart, storage) => {
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

      return products.map(product => new CartProduct(product))
    }

    /**
     * Route binding (controller)
     * @param {Vue} app - the main Vue instance (not the header)
     */
    function registerRoutes (app) {
      router('/checkout', (context) => {
        // console.log('inside checkout '.concat(JSON.stringify(context.params.uid)))
        let user = storage.get('user')
        repo.get(user.email, (err, products) => {
          if (err) {
            console.log(err)
            // TODO: render error view
          }
          console.log('inside repo get ')
          console.log(products[0])

          if (products && products.length) {
            cartComponent.setProducts(new Cart(new ProductSearchResult(products)))
            app.currentView = 'productsInCart'
          } else {
            // TODO: route to a "none found" page
            router.navigate('/')
          }
        })
      })
    }

    return { registerRoutes }
  }
}
