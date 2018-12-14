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

        console.log('in cartController.js /checkout')
        let user = storage.get('user')
        if (!user) {
          router.navigate('/login')
        }

        repo.get(user.email, (err, products) => {
          if (err) {
            console.log(err)
            // TODO: render error view
          }
          products.forEach(product => {
            product.quantity = 1
          })
          console.log('inside repo get ')

          console.log(products.length)

          if (products && products.length) {
            console.log('reset')
            cartComponent.setProducts(new Cart(new ProductSearchResult(products)))
            app.currentView = 'productsInCart'
          } else {

            router.navigate('/')
          }
        })
      })


      router('/paymentToServer/:productsAndToken', (context) => {
        console.log('in cartcontroller pay')
        let body = JSON.parse(context.params.productsAndToken)
        body['email'] = storage.get('user').email
        console.log(body)
        repo.checkout(body, (err, success) => {
          if (err) {
            console.log(err)
          }
          console.log(success)
          router.navigate('/checkout') // TODO: fail to refresh by click cart button
        })
      })

      router('/addToCart/:uid', (context) => {
        console.log('in cartcontroller add to cart '.concat(context.params.uid))
        var body = {email: storage.get('user').email, p: context.params.uid}
        repo.add(body, (err, success) => {
          if (err) {
            console.log(err)
          }
          console.log('add to cart successful')

        })
      })
    }

    return { registerRoutes }
  }
}
