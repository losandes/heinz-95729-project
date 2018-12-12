module.exports.name = 'checkoutController'
module.exports.dependencies = ['router', 'checkout']
module.exports.factory = function (router, checkout) {
  router.post('/checkout/:email', function (req, res) {
    const checkoutInfo = req.body.checkout

    Promise.resolve(checkoutInfo)
      .then(checkoutInfo => new Promise(checkout.charge(checkoutInfo, new Date())))
      .then(charge => res.status(200).send(charge))
      .catch(err => {
        console.log(err)
        res.status(401).send(err)
      })
  })

  return router
}
