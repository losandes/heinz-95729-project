module.exports = {
  scope: 'heinz',
  name: 'ordersController',
  dependencies: ['router', 'ordersComponent', 'ordersRepo', 'Orders', 'storage'],
  factory: (router, ordersComponent, repo, Orders, storage) => {
    'use strict'
        /**
         * Route binding (controller)
         * @param {Vue} app - the main Vue instance (not the header)
         */

         function OrdersSearchResult (products) {
           if (!Array.isArray(products)) {
             return {
               products: []
             }
           }

           return {
             products: products.map( product => new Orders(product.items))
           }
         }

        function registerRoutes (app) {

          router('/userproducts', (context) => {
            repo.history(storage.get('user')._id, (err, products) => {
              if (err) {
                console.log(err)
                router.navigate('/error')
              }

              if (products && products.length) {
                ordersComponent.setProducts(new OrdersSearchResult(products))
                app.currentView = 'orders'
              } else {

                router.navigate('/error')
              }
            })
          })

        }

        return { registerRoutes }
      }
    }
