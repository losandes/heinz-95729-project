module.exports.name = 'groceriesController'
module.exports.dependencies = ['router', 'searchGroceries', 'getGrocery', 'FPGrowthRecommendation']
module.exports.factory = function(
  router, {
    searchGroceries,
    getGroceryByIds,
    bindToManyGroceries
  }, {
    getGrocery,
    bindToGrocery
  }, {
    getRecommendation
  }
) {
  router.get('/groceries', function(req, res) {
    Promise.resolve(req.query.q)
      .then(query => new Promise(searchGroceries(query)))
      .then(docs => new Promise(bindToManyGroceries(docs)))
      .then(groceries => {
        res.send(groceries)
      }).catch(err => {
        console.log(err)
        res.status(400).send({
          messages: [err.message]
        })
      })
  })

  router.get('/groceries/:uid', function(req, res) {
    var response = {};
    Promise.resolve(req.params.uid)
      .then(query => new Promise(getGrocery(query)))
      .then(docs => new Promise(bindToGrocery(docs)))
      .then(grocery => {
        response["grocery"] = grocery
      })
      .then(results =>new Promise(getGroceryByIds(getRecommendation([req.params.uid]))))
      .then(docs => new Promise(bindToManyGroceries(docs)))
      .then(recommendations => {
        response["recommendation"] = recommendations
        res.send(response)
      })
      .catch(err => {
        console.log(err)
        res.status(400).send({
          messages: [err.message]
        })
      })
  })

  return router
}