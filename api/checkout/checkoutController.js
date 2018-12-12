module.exports.name = 'checkoutController'
module.exports.dependencies = ['router', 'checkout', 'modifyUser']
module.exports.factory = function (
  router,
  checkout,
  { addPurchase }
) {
  router.post('/checkout/:email', function (req, res) {
    const checkoutInfo = req.body.checkout
    const purchaseDate = new Date()

    Promise.resolve(checkoutInfo)
      .then(checkoutInfo => new Promise(checkout.charge(checkoutInfo, purchaseDate)))
      .then(() => new Promise(addPurchase(checkoutInfo, purchaseDate)))
      .then(() => res.status(200).send({ 'status': 'Payment complete and purchase history updated.' }))
      .catch(err => {
        res.status(400).send(err)
      })
  })

  return router
}
