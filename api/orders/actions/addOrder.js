module.exports.name = 'addOrder'
module.exports.dependencies = ['ordersRepo', 'cartsRepo', 'Order']
module.exports.factory = function (repo, cartsRepo, Order) {
  'use strict'

  const addOrder = (cart) => (resolve, reject) => {
    return repo.add(cart)
      .then(resolve)
      .catch(reject)
  }


  return { addOrder }
}
