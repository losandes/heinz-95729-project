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
        let user = storage.get('user')
        repo.get(user.email, (err, products) => {
          if (err) {
            console.log(err)
            // TODO: render error view
          }
          products.forEach(product => {
            product.quantity = 1
          })
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

      router('/pay', (context) => {
        // let user = storage.get('user')
        console.log('move to strip')
        // app.currentView = 'strip'
        var handler = StripeCheckout.configure({
          key: 'pk_test_TYooMQauvdEDq54NiTphI7jx',
          image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
          locale: 'auto',
          token: function (token) {
            // You can access the token ID with `token.id`.
            // Get the token ID to your server-side code for use.
          }
        })

        handler.open({
          name: 'Stripe.com',
          description: '2 widgets',
          zipCode: true,
          amount: 2000
        })

        // Close Checkout on page navigation:
        window.addEventListener('popstate', function () {
          handler.close()
        })
      })
    }

    return { registerRoutes }
  }
}
