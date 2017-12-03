module.exports.name = 'FpTree'

module.exports.dependencies = ['FpTreeMiner']
module.exports.factory = function Factory(FpTreeMiner) {
  'use strict'
  const FPItem = require('./FpItem')
//console.log(FPItem.factory())
  const Item = FPItem.factory()
  const Freq = require('./FrequentItems')
//console.log(Freq.factory())
  const FrequentItems = Freq.factory()
  const FPnoode = require('./FpNode')
//console.log(FPnoode.factory())
  const Node = FPnoode.factory()
  /**
   * For each of a transaction's items, map the item to the FpItem model.
   * @param {Object} transaction - a single transaction with an array of items
   */
  const mapTransactionToItems = (transaction) => {
    //console.log(Item)
    return transaction.items.map(item => {
      return new Item(transaction.id, item)
    })
  }

  /**
   * For each transaction in a dataset, map the transaction's items to the
   * FpItem model.
   * @param {Array<Object>} data - an array of transactions
   */
  const mapDataToItems = (data) => {
    var output = []

    data.forEach(tx => {
      output = output.concat(mapTransactionToItems(tx))
    })

    return output
  }

  /**
   * Convert a transaction's items to a FrequentItems model / Headers table
   * @param {Array<Item>} items - the transaction's items, having been mapped to FpItem
   * @param {number} threshold - the threshold below which items are not considered frequent
   */
  const makeHeaders = (items, threshold) => {
    return new FrequentItems(items, threshold)
  }

  /**
   * Recursively add branches and leaves to the FpTree
   * @param {FpNode} root - the root of the FpTree
   * @param {Generator<Item>} yieldedItems - the items in this branch
   * @param {FrequentItems} headers - the header table
   */
  const appendTree = (root, yieldedItems, headers) => {
    const child = yieldedItems.next().value

    if (!child) {
      // we reached the end of the yielded items
      return
    }

    const newRoot = root.addOrIncrementChild(child)
    headers.addNodeLink(newRoot)

    // recurse
    appendTree(newRoot, yieldedItems, headers)
  }

  /**
   * The FpTree
   * @param {Array<Object>} data - an array of transactions
   * @param {number} threshold - the threshold below which items are not considered frequent
   */
  return function FrequentItemsTree(data, threshold = 1) {
    console.log("In here")
    const items = mapDataToItems(data)
    const headers = makeHeaders(items, threshold)
    const root = new Node({
      groupId: '0',
      name: 'root',
      parent: null
    })

    data.forEach(tx => {
      let items = mapTransactionToItems(tx)
      appendTree(root, headers.yieldSortedFrequentItems(items), headers)
    })

    return {
      items: items,
      headers: headers,
      tree: root
    }
  }
} // /Factory
