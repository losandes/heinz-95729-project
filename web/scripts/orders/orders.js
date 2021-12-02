module.exports = {
  scope: 'heinz',
  name: 'orders',
    dependencies: ['router'],
    factory: (router) => {
    'use strict'

      return function orders (orders) {
          orders = Object.assign({}, orders)

      const self = {
       
        images: [],
        thumbnailHref: '/images/products/default.png',
       
      }

      self.viewDetails = (event) => {
        if (!self.uid) {
          // this must be the default VM
          return
        }

      router.navigate(`/orders`)
        
        
      }

       

      return self
    }
  },
}
