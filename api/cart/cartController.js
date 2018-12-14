module.exports.name = 'cartController'
module.exports.dependencies = ['router', 'searchCart', 'addToCart', 'removeFromCart']
module.exports.factory = function (router, search, add, remove) {
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

  router.post('/addToCart', function (req, res) {
    console.log('add one to cart')
    Promise.resolve()
      .then(() => add.add(req.body.p, req.body.email))
      .then(success => {
        res.status(200).send(success)
      }).catch(err => {
        console.log(err)
        res.status(400).send({ messages: [err.message] })
      })
  })

  router.post('/checkout', function (req, res) {
    console.log('checkout ')
    let cart = req.body.cart
    console.log(cart) // products & email & token id
    Promise.resolve()
      .then(() => remove.remove(cart.ps, cart.email))
      .then(success => {
        console.log('in checkout cart controller')
        // res.status(200).send(success)
      }).catch(err => {
        console.log(err)
        res.status(400).send({ messages: [err.message] })
      })
    res.send('successed')
  })




  return router
}

