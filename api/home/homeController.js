module.exports.name = 'homeController'
module.exports.dependencies = ['router','getFive']
module.exports.factory = function (
  router,
  {getFive, bindToManyProducts })
  'use strict'
  {
  router.get('/', function (req,res) {
    Promise.resolve(req)
      .then(query => new Promise(getFive()))
      .then(docs => new Promise(bindToManyProducts(docs)))
      .then(products => {
        res.send(products)
      }).catch(err => {
        console.log(err)
        res.status(400).send({ messages: [err.message] })
      })
  })

  return router
}
