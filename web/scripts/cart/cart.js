module.exports = {
    scope: 'heinz',
    name: 'cart',
    dependencies: ['router'],
    factory: (router) => {
        'use strict'

        return function cart(cart) {
            cart = Object.assign({}, cart)

            const self = {

                images: [],
                thumbnailHref: '/images/products/default.png',

            }

            self.viewDetails = (event) => {
                if (!self.uid) {
                    // this must be the default VM
                    return
                }

                router.navigate(`/cart`)


            }



            return self
        }
    },
}
