/**
 * Created by kavya on 12/2/17.
 */

module.exports.name = 'FPGrowthController'
module.exports.dependencies = ['router']
module.exports.factory = function Factory(
  router) {
  router.get('/reco', function (req, res) {
    const FPTree = require('./FpTree.js');
    //console.log(FPTree.factory())
    const FrequentItemsTree = FPTree.factory()
    var recs = [
      { "id": 1, "items": ["Apples", "Berries", "DragonFruit", "Endive"] },
      { "id": 2, "items": ["Berries", "Chocolate", "Endive"] },
      { "id": 3, "items": ["Apples", "Berries", "DragonFruit", "Endive"] },
      { "id": 4, "items": ["Apples", "Berries", "Chocolate", "Endive"] },
      { "id": 5, "items": ["Apples", "Berries", "Chocolate", "DragonFruit", "Endive"] },
      { "id": 6, "items": ["Berries", "Chocolate", "DragonFruit"] },
      { "id": 7, "items": ["Apples"] }
    ]
    var tree = new FrequentItemsTree(recs)
    //console.log(tree.headers.getHeaderTable())
    console.log(tree.tree.children)
    res.send("Done")
  })

  return router
}