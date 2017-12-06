/**
 * Created by kavya on 12/2/17.
 */

module.exports.name = 'FPGrowthController'
module.exports.dependencies = ['router']
module.exports.factory = function Factory(
  router) {
  router.get('/reco', function (req, res) {
    const prettyTree = require('pretty-tree')

    const item = require('./FpItem.js').factory()
    const node = require('./FpNode.js').factory()
    const frequentItems = require('./FrequentItems.js').factory()
    const fpTreeFactory = require('./FpTree.js').factory
    const fpTreeMinerFactory = require('./FpTreeMiner.js').factory()
    const treePrinterFactory = require('./FpTreePrinter.js').factory
    const data = require('./example-data.json')
    const FpTree = fpTreeFactory(item, frequentItems, node)
    const printer = treePrinterFactory(prettyTree)
    const fpTreeMiner = fpTreeMinerFactory(FpTree, node)
    const exampleTree = new FpTree(data, 4)

    console.log('\nFrequent Items Tree')
    printer.print(exampleTree.tree)
    const results = new fpTreeMiner(FpTree, node);
    res.send("Done")
  })

  return router
}