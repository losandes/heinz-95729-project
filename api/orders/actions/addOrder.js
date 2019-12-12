module.exports.name = 'addOrder'
module.exports.dependencies = ['ordersRepo', 'cartsRepo', 'Order']
module.exports.factory = function (repo, cartsRepo, Order) {
  'use strict'

  const addOrder = (cart) => (resolve, reject) => {
    var order = Object.assign({}, cart)
    var items = order.items
   
    for (var i=0; i < items.length; i++){
      //user can download the quantity he/she orders plus one addition
      items[i].downloads = parseInt(items[i].quantity) + 1
      items[i].quantity = parseFloat(items[i].quantity)
    }
    
    order.items = items
    order.total = parseFloat(order.total)
   
    return repo.add(order)
      .then(resolve)
      .catch(reject)
  }


  return { addOrder }
}
