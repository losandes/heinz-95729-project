module.exports.name = 'addToCart'
module.exports.dependencies = ['db']
module.exports.factory = function (db) {
  'use strict'
  const cartCollection = db.collection('cart')

  const add = (pid, email) => {
    console.log('tring to add a product to the database: '.concat(pid).concat(email))
    return new Promise(function (resolve, reject) {
      cartCollection.find({email: email, pid: pid}).toArray(function (err, result) {
        if (err) throw err
        console.log('result------------>')
        console.log(result)
        if (!result || result.length === 0) {
          cartCollection.insertOne({email: email, pid: pid, amount: 1}, function (err, res) {
            if (err) throw err
            console.log('1 document inserted')
          })
        } else {
          console.log('already in cart')
        }
        // db.close()
        resolve('success')
      })
    })
  }

  return {add}
}
