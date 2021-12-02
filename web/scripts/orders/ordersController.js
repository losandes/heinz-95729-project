module.exports = {
  scope: 'heinz',
    name: 'ordersController',
    dependencies: ['router', 'ordersComponent', 'orders', 'ordersRepo'],
    factory: (router, ordersComponent, orders, repo) => {
    'use strict'

    /**
     * A view model for the search results (an array of products)
     * @param {Array} orders - the products that were returned by the result
     */
      function ordersSearchResult(orders) {
          if (!Array.isArray(orders)) {
        return {
            orders: [],
        }
      }

          return {
          orders: orders.map(orders => orders),
      }
    }

    /**
     * Route binding (controller)
     * @param {Vue} app - the main Vue instance (not the header)
     */
      function registerRoutes(app) {
        router('/orders', (context) => {
        app.currentView = 'loading'

            repo.get((err, orders) => {
          if (err) {
            console.log(err)
            // TODO: render error view
          }

                if (orders && orders.length) {
                    console.log(orders)
                ordersComponent.setorders(new ordersSearchResult(orders))
                app.currentView = 'orders'
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
