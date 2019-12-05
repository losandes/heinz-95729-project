module.exports.name = 'addOrder'
module.exports.dependencies = ['ordersRepo', 'cartsRepo', 'Order']
module.exports.factory = function (repo, cartsRepo, Order) {
  'use strict'

  const addOrder = (cart) => (resolve, reject) => {
    var order = Object.assign({}, cart)
    var items = order.items
   
    for (var i=0; i < items.length; i++){
      items[i].downloads = items[i].quantity
    }
    
    order.items = items
    return repo.add(order)
      .then(resolve)
      .catch(reject)
  }


  return { addOrder }
}
