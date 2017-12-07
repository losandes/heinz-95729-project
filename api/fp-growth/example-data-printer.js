const prettyTree = require('pretty-tree')

const item = require('./FpItem.js').factory()
const node = require('./FpNode.js').factory()
const frequentItems = require('./FrequentItems.js').factory()
const fpTreeFactory = require('./FpTree.js').factory
const fpTreeMinerFactory = require('./FpTreeMiner.js').factory
const treePrinterFactory = require('./FpTreePrinter.js').factory
const data = require('./example-data.json')
const FpTreeClass = require('./FpTree.js').factory()
const FpTree = fpTreeFactory(item, frequentItems, node)
const printer = treePrinterFactory(prettyTree)
const fpTreeMiner = fpTreeMinerFactory(FpTreeClass, node)
const exampleTree = new FpTree(data, 4)

console.log('\nFrequent Items Tree')
printer.print(exampleTree.tree)
const results = new fpTreeMiner(exampleTree).findPatterns(['Endive', 'Apples'], 1);
const resultsTree = new FpTree(results, 1)
printer.print(resultsTree.tree)