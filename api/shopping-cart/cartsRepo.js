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

  /*
    // Create a Cart
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

  return { get, create }
}
