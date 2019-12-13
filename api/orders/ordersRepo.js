/*
// See the README.md for info on this module
*/
module.exports.name = 'ordersRepo'
module.exports.singleton = true
module.exports.dependencies = ['db', 'Order', '@polyn/blueprint', 'mongodb']
module.exports.factory = function (db, Order, _blueprint, _mongodb) {
  'use strict'

  const { is, optional } = _blueprint
  const { ObjectID } = _mongodb
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
        return reject(new Error('A uid is required to get orders'))
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

  /**
   * Retrieve a singe order
   * @param {string} id - The id of the order
   */
  const getOne = (id) => {
    return new Promise((resolve, reject) => {
      if (is.not.string(id)) {
        return reject(new Error('A uid is required to get an order'))
      }
      
      collection.find({ _id: ObjectID(id) })
        .next((err, doc) => {
          if (err) {
            return reject(err)
          }

          if (doc) {
            return resolve(doc)
          } else {
            return resolve()
          }
        })
      })
  }

  /**
   * Reduce the download quantity of an item in an order
   * @param {string} id, the id of the order
   * @param {string} uid, the id of the item
   */
  const reduceDownloadQuantity = (id, uid) => {
    
    return new Promise((resolve, reject) => {
      if (is.not.string(uid)) {
        return reject(new Error('A uid is required to reduce download quantity'))
      }

      collection.updateOne(
        { _id: ObjectID(id), "items.item_uid": uid },
        { $inc: { "items.$.downloads": -1 } },
        (err, doc) => {
          if(err){
            return reject(err)
          }else{
            return resolve(doc)
          }
        }
      )
    })
  }

  return { get, add, getOne, reduceDownloadQuantity }
}
