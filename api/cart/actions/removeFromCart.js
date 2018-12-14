module.exports.name = 'removeFromCart'
module.exports.dependencies = ['db']
module.exports.factory = function (db) {
  'use strict'
  const cartCollection = db.collection('cart')

  const remove = (uids, email) => {
    console.log('tring to delete products from the database: '.concat(JSON.stringify(uids)).concat(email))
    return new Promise(function (resolve, reject) {
      cartCollection.deleteMany({email: email, pid: {$in: uids}}, function (err, obj) {
        if (err) throw err
        console.log(obj.result.n + ' document(s) deleted')
        resolve('success')
        // db.close()
      })
    })
  }

  return {remove}
}
