/*
// See the README.md for info on this module
*/
module.exports.name = 'cartsRepo'
module.exports.singleton = true
module.exports.dependencies = ['db', 'Cart', '@polyn/blueprint']
module.exports.factory = function (db, Cart, _blueprint) {
  'use strict'

  const { is, optional } = _blueprint
 
  const collection = db.collection(Cart.db.collection)

  Cart.db.indexes.forEach(index => {
    collection.createIndex(index.keys, index.options)
  })

  /**
   * Creates a new shopping cart with an item
   * @param {Object} payload - the item to be added to the new shopping cart
   * @param {string} payload.uid - the uid of the user for whom this cart is being created
   * @param {string} payload.name - the name of the item
   * @param {number} payload.quantity - the quantity of items to add
   * @param {decimal} payload.price - unit price of each item
   */
  const create = (payload) => {
    return new Promise((resolve, reject) => {
      if (is.not.object(payload)) {
        return reject(new Error('A payload is required to create a Cart'))
      }

      collection.insertOne(payload, (err, res) => {
        if (err) {
          return reject(err)
        }

        return resolve(res)
      })
    })
  }

  /**
   * Adds an item to an existing shopping cart
   * @param {Object} payload - the item details
   * @param {string} payload.name - the name of the item to be added
   * @param {number} payload.quantity - the quantity of the items
   * @param {decimal} payload.price - unit price of the item to be added
   * @param {string} payload.uid - the uid of the user whose cart is being updated
   */
  const add = (payload) => {
    return new Promise((resolve, reject) => {
      if(is.not.string(payload.uid)){
        return reject(new Error('A uid is required to get a Cart'))
      }

      var item = Object.assign({}, payload)
      delete item.uid
      collection.findOneAndUpdate(
        { uid: payload.uid},
        { $push: { items:  item } },
        (err, doc) => {
          if (err){
            return reject(err)
          }else{
            return resolve(doc)
          }
        }
      )
    })
  }

  /**
   * Updates the quantity of an item in a cart
   * @param {Object} payload - contains details of item to be updated
   * @param {string} payload.uid - the uid of the cart owner
   * @param {string} payload.item_uid - the uid of the item to be updated
   * @param {nunmber} payload.quantity - the new quantity of the item
   */
  const updateItemQuantity = (payload) => {
    return new Promise((resolve, reject) => {
      if (is.not.string(payload.uid)) {
        return reject(new Error('A uid is required to get a Cart'))
      }

      collection.updateOne(
        { uid: payload.uid, "items.item_uid": payload.item_uid },
        { $set: { "items.$.quantity" : payload.quantity } },
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


  /**
   * Deletes an item from a shopping cart
   * @param {Object} payload - contains details of item to be deleted
   * @param {string} payload.uid - the uid of the cart owner
   * @param {string} payload.item_uid - the uid of the item to be deleted
   */
  const deleteCartItem = (payload) => {
    return new Promise((resolve, reject) => {
      if (is.not.string(payload.uid)) {
        return reject(new Error('A uid is required to get a Cart'))
      }

      collection.updateOne(
        { uid: payload.uid, "items.item_uid": payload.item_uid },
        { $pull: { items: { item_uid: payload.item_uid } } },
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

  /**
   * Deletes a shopping cart
   * @param {string} uid - the uid of the cart owner
   */
  const deleteCart = (uid) => {
    return new Promise((resolve, reject) => {
      if (is.not.string(uid)) {
        return reject(new Error('A uid is required to get a Cart'))
      }

      collection.deleteOne(
        { uid: uid },
        
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


  /**
   * Updates the total price of a shopping cart
   * @param {string} uid - the uid of the cart owner
   * @param {string} total - the total price of items in the shopping cart
   */
  const updateCartTotal = (uid, total) => {
    return new Promise((resolve, reject) => {
      if (is.not.string(uid)) {
        return reject(new Error('A uid is required to get a Cart'))
      }
      collection.findOneAndUpdate(
        { uid: uid },
        {
          $set: { total: total }
        },
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

  /**
   * Get a single Cart
   * @param {string} uid - the ID of the user whose cart is this
   */
  const get = (uid) => {
    return new Promise((resolve, reject) => {
      // Blueprint isn't helpful for defending arguments, when they are
      // not objects. Here we defend the function arguments by hand.
      if (is.not.string(uid)) {
        return reject(new Error('A uid is required to get a Cart'))
      }

      // This uses mongodb's find feature to obtain 1 document, by
      // limiting the result. `find` and `limit` return promises, so
      // the query isn't executed until `next` is called. It receives a
      // callback function so it can perform the IO asynchronously, and
      // free up the event-loop, while it's waiting.
      collection.find({ uid })
        .limit(1)
        .next((err, doc) => {
          if (err) {
            return reject(err)
          }

          return resolve(doc)
        })
    })
  }

  return { get, create, add, updateCartTotal, updateItemQuantity, deleteCartItem, deleteCart }
}
