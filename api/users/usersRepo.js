module.exports.name = 'usersRepo'
module.exports.dependencies = ['db', 'User', '@polyn/blueprint']
module.exports.factory = (db, User, _blueprint) => {
  'use strict'

  const { is } = _blueprint
  const collection = db.collection(User.db.collection)
  const ObjectID  = require('mongodb').ObjectID

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

      if (is.not.string(payload.email)) {
        return reject(new Error('An email is required to create a User'))
      }
      // en1
      collection.insertOne(payload, (err, res) => {
        if (err) {
          return reject(err)
        }

        return resolve(res)
      })
    })
  }

  /*
    // Get a single user
    */
  const get = (email,password) => {
 
    return new Promise((resolve, reject) => {
      if (is.not.string(email)) {
        return reject(new Error('An email is required to get a User'))
      }
        if (is.not.string(password)) {
            return reject(new Error('A password is required to get a User'))
        }

      collection.find({ email,password})
        .limit(1)
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

  const getUserById = (id) => {
    return new Promise((resolve, reject) => {
      if (is.not.string(id)) {
        return reject(new Error('An ID is required to get a User'))
      }
       

      collection.find({ _id: ObjectID(id) })
        .limit(1)
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

  return { create, get, getUserById }
}
