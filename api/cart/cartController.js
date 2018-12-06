module.exports.name = 'cartController'
module.exports.dependencies = ['router', 'searchCart']
module.exports.factory = function (router, search) {
  router.get('/cart/:email', function (req, res) {
    console.log('inside cartController.js /cart')
    Promise.resolve(req.params.email)
      .then(email => search.searchCart(email))
      .then(r => {
        // console.log(' inside cartController r='.concat(JSON.stringify(r)))
        res.send(JSON.stringify(r))
      })
      .catch()
  })

  router.post('/checkout', function (req, res) {
    console.log('checkout ')
    let cart = req.body.cart
    console.log(cart)
    res.send('successed')
  })



  return router
}

