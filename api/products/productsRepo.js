/*
// See the README.md for info on this module
*/
module.exports.name = 'productsRepo'
module.exports.singleton = true
module.exports.dependencies = ['db', 'Product', 'polyn']
module.exports.factory = function (db, Product, { Blueprint, is }) {
  const collection = db.collection(Product.db.collection)
  const findOptionsBlueprint = new Blueprint({
    query: 'object',
    skip: {
      type: 'number',
      required: false
    },
    limit: {
      type: 'number',
      required: false
    }
  })

  Product.db.indexes.forEach(index => {
    collection.createIndex(index.keys, index.options)
  })

  /**
   * Find products
   * @param {Object} options - the query options
   * @param {Object} options.query - the mongodb query
   * @param {number} options.skip - the number of records to skip before taking records
   * @param {number} options.limit - the number of records to take
   */
   
  const getFive = (options) =>{
	options = Object.assign({
      skip: 0,
      limit: 5
    }, options)
	
	return new Promise((resolve, reject) => {
     // Since options is an object, we can use Blueprint to validate it.
      if (!findOptionsBlueprint.syncSignatureMatches(options).result) {
        return reject(new Error(
          findOptionsBlueprint.syncSignatureMatches(options)
            .errors
            .join(', ')
        ))
      }

      // This uses mongodb's find feature to obtain multiple documents,
      // although it still limits the result set. `find`, `skip`, and `limit`
      // return promises, so the query isn't executed until `toArray` is
      // called. It receives a callback function so it can perform the
      // IO asynchronously, and free up the event-loop, while it's waiting.
      collection.find().sort({purchased_quantity:-1})
        .skip(options.skip)
        .limit(options.limit)
        .toArray(function (err, docs) {
          if (err) {
            return reject(err)
          }

          return resolve(docs.map(doc => new Product(doc)))
        })
    })
  }
   
   
  const find = (options) => {
    // Make sure the options are defined, and set the default
    // skip and limit values if they weren't set
    options = Object.assign({
      skip: 0,
      limit: 20
    }, options)

    return new Promise((resolve, reject) => {
      // Since options is an object, we can use Blueprint to validate it.
      if (!findOptionsBlueprint.syncSignatureMatches(options).result) {
        return reject(new Error(
          findOptionsBlueprint.syncSignatureMatches(options)
            .errors
            .join(', ')
        ))
      }

      // This uses mongodb's find feature to obtain multiple documents,
      // although it still limits the result set. `find`, `skip`, and `limit`
      // return promises, so the query isn't executed until `toArray` is
      // called. It receives a callback function so it can perform the
      // IO asynchronously, and free up the event-loop, while it's waiting.
      collection.find(options.query)
        .skip(options.skip)
        .limit(options.limit)
        .toArray(function (err, docs) {
          if (err) {
            return reject(err)
          }

          return resolve(docs.map(doc => new Product(doc)))
        })
    })
  }

  /**
   * Get a single Product
   * @param {string} uid - the human readable uid of the product
   */
  const get = (uid) => {
    return new Promise((resolve, reject) => {
      // Blueprint isn't helpful for defending arguments, when they are
      // not objects. Here we defend the function arguments by hand.
      if (is.not.string(uid)) {
        return reject(new Error('An uid is required to get a Product'))
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

          return resolve(new Product(doc))
        })
    })
  }

  return { find, get, getFive }
}
