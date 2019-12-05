module.exports.name = 'orderDownload'
module.exports.dependencies = ['ordersRepo']
module.exports.factory = function (repo) {
  'use strict'
 
  const getDownloadQuantity = (order_id, uid) => {

    return repo.getOne(order_id)
      .then(order => {
       
        for (var i = 0; i < order.items.length; i++){
          
          if (order.items[i].item_uid == uid){
            return order.items[i].downloads
          }
          return 0
        }
      })
      
  }

  const reduceBookDownloadQuantity = (order_id, uid) => (resolve, reject) => {
    
      return repo.reduceDownloadQuantity(order_id, uid)
        .then(resolve)
        .catch(reject)
  }


  return { getDownloadQuantity, reduceBookDownloadQuantity }
}
