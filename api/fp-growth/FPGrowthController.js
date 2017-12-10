module.exports.name = 'FPGrowthController'
module.exports.dependencies = ['router', 'FPGrowthRecommendation', 'searchGroceries']
module.exports.factory = function Factory(
    router, {
        getRecommendation
    },{
    searchGroceries,
    getGroceryByIds,
    bindToManyGroceries
  }
) {

    router.get('/getRecommendation', function(req, res) {
        var queryData = req.query.uids.split(",")
        console.log("queryData:" + queryData.length)
        Promise.resolve(queryData)
            .then(results => new Promise(getGroceryByIds(getRecommendation(queryData))))
            .then(docs => new Promise(bindToManyGroceries(docs)))
            .then(recommendations => {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({"cartReco": recommendations}))
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