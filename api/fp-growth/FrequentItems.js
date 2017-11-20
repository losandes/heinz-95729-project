module.exports.name = 'FrequentItems'
module.exports.dependencies = []
module.exports.factory = function Factory () {
  'use strict'

  /**
   * An object representing an item in the Header table
   * @param {FpItem} item - an Fpitem that belongs in the Header table
   */
  function HeaderItem (item) {
    return {
      name: item.name,
      count: 1,
      item: item,
      nodeLinks: []
    }
  }

  /**
   * The FrequentItems constructor
   * @param {Array<FpItem>} items - the items from a transaction
   * @param {number} minimumSupportThreshold - the threshold below which items are not considered frequent
   */
  return function FrequentItems (items, minimumSupportThreshold = 1) {
    var table = {}
    var array = []

    /**
     * Increment a header item by name, and the given count, or 1
     * @param {string} name - the name of the header item to increment
     * @param {number?} count - the amount by which to increment
     */
    const increment = (name, count = 1) => {
      table[name].count += count
    }

    /**
     * Add a reference from the header table to a node in a branch
     * @param {FpNode} node - the node to add the reference to
     */
    const addNodeLink = (node) => {
      table[node.name].nodeLinks.push(node)
    }

    /**
     * If the item already exists in the header table, increment it's count,
     * otherwise add it to the header table with an initial count of 1.
     * @param {FpItem} item - the item to add or increment
     */
    const addOrIncrement = (item) => {
      item = Object.assign({}, item)

      if (table[item.name]) {
        increment(item.name, 1)
        return table[item.name]
      }

      table[item.name] = new HeaderItem(item)

      return table[item.name]
    }

    /**
     * A sort algorithm that sorts by count, descending
     * @param {HeaderItem} a - an item from the header table
     * @param {HeaderItem} b - another item from the header table
     */
    const byCountDescending = (a, b) => {
      return b.count - a.count
    }

    /**
     * A sort algorithm that sorts by the count of the matching item in the
     * header table, descending
     * @param {FpItem} a - an item from the header table
     * @param {FpItem} b - another item from the header table
     */
    const byTableCountDescending = (a, b) => {
      return table[b.name].count - table[a.name].count
    }

    /**
     * Return the header table, and the header table as an array
     */
    const getTableAndArray = () => {
      return {
        headerTable: table,
        headerArray: array
      }
    }

    /**
     * Return just the header table
     */
    const getTable = () => {
      return getTableAndArray().headerTable
    }

    /**
     * Return just the header table as an array
     */
    const getTableAsArray = () => {
      return getTableAndArray().headerArray
    }

    /**
     * Get a HeaderItem, by name
     * @param {string} name - the name by which to get the HeaderItem
     */
    const getHeader = (name) => {
      return table[name]
    }

    /**
     * Check to see if a HeaderItem exists, by name
     * @param {string} name - the name by which to verify the HeaderItem
     */
    const hasHeader = (name) => {
      return getHeader(name) !== undefined
    }

    /**
     * Build the header table array, and prune both the header table and the
     * array, removing Header items that aren't frequent enough to pass the
     * minimumSupportThreshold.
     */
    const prune = () => {
      array = Object.keys(table)
        .filter(key => {
          let item = table[key]
          return item.count >= minimumSupportThreshold
        }).map(key => {
          return table[key]
        }).sort(byCountDescending)

      table = {}

      array.forEach(item => {
        table[item.name] = item
      })
    }

    /**
     * Given an array of FpItems, this will remove items that aren't frequent,
     * return matching HeaderItems in descending order, by frequency.
     * @param {Array<FpItem>} items - the items from a transaction
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator
     */
    function * yieldSortedFrequentItems (items) {
      const output = items.filter(item => {
        return table[item.name]
      }).sort(byTableCountDescending)
      var n = 0

      while (output[n]) {
        yield output[n]
        n += 1
      }
    }

    // If this instance of FrequentItems was instantiated with an array of
    // FpItems, build a header table from them.
    if (items) {
      // this instance was initialized with data
      // set up the header table
      items.forEach(item => addOrIncrement(item))
      prune()
    }

    // The public API of FrequentItems
    return {
      addNodeLink,
      getHeader,
      hasHeader,
      getHeaderTable: getTable,
      getHeaderTableAsArray: getTableAsArray,
      getHeaderTableAndArray: getTableAsArray,
      yieldSortedFrequentItems
    }
  }
} // /Factory
