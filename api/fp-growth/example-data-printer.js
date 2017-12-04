const prettyTree = require('pretty-tree')

const item = require('./FpItem.js').factory()
const node = require('./FpNode.js').factory()
const frequentItems = require('./FrequentItems.js').factory()
const fpTreeFactory = require('./FpTree.js').factory
const treePrinterFactory = require('./FpTreePrinter.js').factory
const data = require('./example-data.json')

const FpTree = fpTreeFactory(item, frequentItems, node)
const printer = treePrinterFactory(prettyTree)

const exampleTree = new FpTree(data, 4)

console.log('\nFrequent Items Tree')
printer.print(exampleTree.tree)