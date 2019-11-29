/*
// See the README.md for info on this module
*/
module.exports.name = 'ordersRepo'
module.exports.singleton = true
module.exports.dependencies = ['db', 'Order', '@polyn/blueprint']
module.exports.factory = function (db, Order, _blueprint) {
  'use strict'

  const { is, optional } = _blueprint
 
  const collection = db.collection(Order.db.collection)

  Order.db.indexes.forEach(index => {
    collection.createIndex(index.keys, index.options)
  })

  /**
   * Adds shopping cart items to order after successful checkout
   * @param {Object} payload - the shopping cart to be added
   * @param {string} payload.uid - the uid of the user for whom this order is being created
   * @param {string} payload.total - total price of items in the shopping cart
   * @param {number} payload.items - the the items in the shopping cart
   */
  const add = (payload) => {
    return new Promise((resolve, reject) => {
      if (is.not.object(payload)) {
        return reject(new Error('A payload is required to add an order'))
      }
      var order = Object.assign({}, payload)
      order.created = new Date()
      delete order._id


      collection.insertOne(order, (err, res) => {
        if (err) {
          return reject(err)
        }

        return resolve(res)
      })
    })
  }
  
  /**
   * Get all orders of a particular user
   * @param {string} uid - the ID of the user whose orders are being retrieved
   */
  const get = (uid) => {
    return new Promise((resolve, reject) => {
      if (is.not.string(uid)) {
        return reject(new Error('A uid is required to get a Cart'))
      }
      
      collection.find({ uid:uid })
        .toArray((err, doc) => {
          if (err) {
            return reject(err)
          }

          return resolve(doc)
        })
    })
  }

  return { get, add }
}
