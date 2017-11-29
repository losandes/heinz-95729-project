module.exports.name = 'groceriesController'
module.exports.dependencies = ['router', 'searchGroceries', 'getGrocery']
module.exports.factory = function (
  router,
  { searchGroceries, bindToManyGroceries },
  { getGrocery, bindToGrocery }
) {
  router.get('/groceries', function (req, res) {
    Promise.resolve(req.query.q)
      .then(query => new Promise(searchGroceries(query)))
      .then(docs => new Promise(bindToManyGroceries(docs)))
      .then(groceries => {
        res.send(groceries)
      }).catch(err => {
        console.log(err)
        res.status(400).send({ messages: [err.message] })
      })
  })

  router.get('/groceries/:uid', function (req, res) {
    Promise.resolve(req.params.uid)
      .then(query => new Promise(getGrocery(query)))
      .then(docs => new Promise(bindToGrocery(docs)))
      .then(grocery => {
        res.send(grocery)
      }).catch(err => {
        console.log(err)
        res.status(400).send({ messages: [err.message] })
      })
  })

  return router
}
