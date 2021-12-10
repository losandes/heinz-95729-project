
module.exports = {
    scope: 'heinz',
    name: 'cartController',
    dependencies: ['router', 'cartComponent', 'cart', 'cartRepo'],
    factory: (router, cartComponent, cart, repo) => {
        'use strict'

        const price = 0
        const productIds = ""

        /**
         * A view model for the search results (an array of products)
         * @param {Array} cart - the products that were returned by the result
         */
        function cartSearchResult(cart) {
            if (!Array.isArray(cart)) {
                return {
                    cart: [],
                }
            }

            return {
                cart: cart.map(cart => cart),
            }
        }

        /**
         * Route binding (controller)
         * @param {Vue} app - the main Vue instance (not the header)
         */
        function registerRoutes(app) {
            router('/cart', (context) => {
                app.currentView = 'loading'

                repo.get((err, cart) => {
                    if (err) {
                        console.log(err)
                        // TODO: render error view
                    }
                    if (cart && cart.length) {
                        var price=0;
                        for (var i = 0; i < cart.length; i++)
                            price = price + parseFloat(cart[i].price)
                        cart.push(price)
                        cartComponent.setcart(new cartSearchResult(cart))
                        app.currentView = 'cart'
                    } else {
                        // TODO: route to a "none found" page
                        router.navigate('/')
                    }
                })
            })
            router('/orders-upsert/:pid/:price', (context) => {
                repo.buyNow(context.params.pid, context.params.price, (err, response) => {
                })
            })
            router('/cart-deleteAll/', (context) => {
                repo.removeAll( (err, response) => {
                })
            })

            router('/success/:pid/:price', (context) => {
                // cartComponent.checkoutSuccess()
                console.log(context.params)
                router.navigate('/orders-upsert/' + context.params.pid + '/' + context.params.price)
                router.navigate('/cart-deleteAll/')
                router.navigate('/orders')
                // repo.buyNow(context.params.pid, context.params.price, (err, response) => {
                // })
                // repo.removeAll( (err, response) => {
                // })
            })

        }

        return { registerRoutes }
    },
}
