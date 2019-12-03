/*
// See the README.md for info on this module
*/
module.exports.name = 'Order'
module.exports.dependencies = ['@polyn/blueprint', '@polyn/immutable', 'Cart']
module.exports.factory = function (_blueprint, _immutable, Cart) {
  'use strict'

  const { immutable } = _immutable

  const Order = immutable('order', {
    //inherit schema from Cart
    ...Cart.blueprint,
    created: 'date',
  })

  //override db settings for Order
  Order.db = {
    // This is the name of the collection
    collection: 'orders',
    // The indexes improve query performance
    indexes: [
      {
        keys: { name: 1 },
        options: { name: 'unq.carts.uid' }
      },
    ]
  }

  return Order
}
