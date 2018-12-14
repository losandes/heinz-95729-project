module.exports.name = 'searchCart'
module.exports.dependencies = ['db', 'ProductInCart', 'getProduct']
module.exports.factory = function (db, ProductInCart, getProduct) {
  'use strict'
  const cartCollection = db.collection('cart')
  const productCollection = db.collection('products')

  // const getProductsAndComposeReply = (arr)

  // get products according to product ids and compose the final result
  const getProductInCart = (userAndProduct) => {
    return new Promise(function (resolve, reject) {
      console.log('inside searchCart.js getProductInCart q='.concat(userAndProduct))
      var pids = []
      for (let i = 0; i < userAndProduct.length; i++) {
        pids[i] = userAndProduct[i]['pid']
      }
      console.log(pids)
      // productCollection.find({ uid: { $in: pids }})
      productCollection.find({ uid: {$in: pids} }).toArray(function (err, arr) {
        if (err) {
          reject(err)
        } else {
          console.log('products arr: '.concat(JSON.stringify(arr)))
          for (let i = 0; i < arr.length; i++) {
            let product = arr[i]
            product['email'] = userAndProduct[i]['email']
            for (let j = 0; j < userAndProduct.length; j++) {
              if (userAndProduct[j]['pid'] == product['uid']) {
                product['quantity'] = userAndProduct[j]['amount']
              }
            }
          }
          resolve(arr)
        }
      })
    })
  }

  const searchCart = (email) => {
    return new Promise(function (resolve, reject) {
      console.log('inside searchCart.js searchcart q='.concat(email))
      cartCollection.find({ email: email }).toArray(function (err, arr) {
        if (err) {
          reject(err)
        } else {
          console.log('arr: '.concat(JSON.stringify(arr)))
          resolve(arr)
        }
      })
    }).then(userAndProduct => getProductInCart(userAndProduct))
  }

  return {searchCart}
}
