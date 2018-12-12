module.exports.name = 'usersRepo'
module.exports.dependencies = ['db', 'UserPurchaseHistory', 'User', 'polyn']
module.exports.factory = (db, UserPurchaseHistory, User, { Blueprint, is }) => {
  const collection = db.collection(User.db.collection)

  User.db.indexes.forEach(index => {
    collection.createIndex(index.keys, index.options)
  })

  /*
  // Create a user
  */
  const create = (payload) => {
    return new Promise((resolve, reject) => {
      if (is.not.object(payload)) {
        return reject(new Error('A payload is required to create a User'))
      }

      collection.insertOne(payload, (err, res) => {
        if (err) {
          return reject(err)
        }

        return resolve(res)
      })
    })
  }


  /*
  // Add Category
  */
  const addCategory = (email, category) => {
    return new Promise((resolve, reject) => {
      if (is.not.string(email)) {
        return reject(new Error('An email is required to add a Category'))
      }

      if (is.not.string(category.categories)) {
        console.log(email)
        console.log(category)
        return reject(new Error('Categories is required to add a Category'))
      }

      // Change category to smaller case, trim
      category.categories = category.categories.toLowerCase().trim()

      collection.findOneAndUpdate({ email }, { $addToSet: category }, (err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  /*
  // Remove Category
  */
  const removeCategory = (email, category) => {
    return new Promise((resolve, reject) => {
      if (is.not.string(email)) {
        return reject(new Error('An email is required to remove a Category'))
      }

      if (is.not.string(category.categories)) {
        return reject(new Error('Categories is required to remove a Category'))
      }

      collection.findOneAndUpdate({ email }, { $pull: category }, (err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  /*
  // Add a purchase to purchase history
  */
  const addPurchase = (checkoutInfo, purchaseDate) => {
    const email = checkoutInfo.email
    const purchaseHistory = {
      time: purchaseDate,
      amount: checkoutInfo.total,
      products: checkoutInfo.products
    }
    return new Promise((resolve, reject) => {
      if (is.not.string(checkoutInfo.email)) {
        return reject(new Error('An email is required to add the purchase'))
      }
      collection.findOneAndUpdate({ email }, { $addToSet: { 'purchaseHistory': purchaseHistory } }, (err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  /*
// Add a purchase to purchase history
*/
  const getPurchases = (email) => {
    return new Promise((resolve, reject) => {
      if (is.not.string(email)) {
        return reject(new Error('An email is required to get purchase history'))
      }

      collection.find({ email })
        .limit(1)
        .next((err, doc) => {
          if (err) {
            return reject(err)
          }

          if (doc) {
            return resolve(new UserPurchaseHistory(doc))
          } else {
            return resolve()
          }
        })
    })
  }

  /*
  // Get a single user
  */
  const get = (email) => {
    return new Promise((resolve, reject) => {
      if (is.not.string(email)) {
        return reject(new Error('An email is required to get a User'))
      }

      collection.find({ email })
        .limit(1)
        .next((err, doc) => {
          if (err) {
            return reject(err)
          }

          if (doc) {
            return resolve(new User(doc))
          } else {
            return resolve()
          }
        })
    })
  }

  return { create, addCategory, removeCategory, addPurchase, getPurchases, get }
}
