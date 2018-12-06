module.exports = {
  scope: 'heinz',
  name: 'Cart',
  dependencies: ['router', 'storage', 'cartRepo'],
  factory: (router, storage, repo) => {
    'use strict'

    return function Cart (ps) {
      const self = {
        products: ps,
        subtotal: 0,
        email: storage.get('user').email
      }

      self.checkout = () => {
        console.log(`TODO: checkout`)
        console.log('subtotal: '.concat(self.subtotal))
        console.log('email: '.concat(self.email))
        console.log(self.products)
        console.log(`TODO: checkout`)
        repo.checkout(self, (err, success) => {
          if (err) {
            console.log(err)
            // TODO: render error view
          }
          console.log('inside repo get ')
          console.log(success)

          // if (products && products.length) {
          //   cartComponent.setProducts(new Cart(new ProductSearchResult(products)))
          //   app.currentView = 'productsInCart'
          // } else {
          //   // TODO: route to a "none found" page
          //   router.navigate('/')
          // }
        })
      }

      return self
    }
  }
}
