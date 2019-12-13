module.exports = {
  scope: 'heinz',
  name: 'Orders',
  dependencies: ['router', 'ordersRepo', 'storage'],
  factory: (router, repo, storage) => {
    'use strict'

    return function Orders(product) {

      product = Object.assign({}, product)

      const self = {
        name: product[0].name,
        price: product[0].price,
        quantity: product[0].quantity,

      }

      return self
    }
  }
}
