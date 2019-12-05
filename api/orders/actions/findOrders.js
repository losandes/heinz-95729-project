module.exports.name = 'findOrders'
module.exports.dependencies = ['ordersRepo', 'Order']
module.exports.factory = function (repo, Order) {
  'use strict'

  const findOrders = (uid) => (resolve, reject) => {
    return repo.get(uid)
      .then(resolve)
      .catch(reject)
  }


  return { findOrders }
}
