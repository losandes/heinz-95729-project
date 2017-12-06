module.exports.name = 'FpTreeMiner'
module.exports.dependencies = ['FpTree', 'FpNode']
module.exports.factory = function Factory (FpTree, Node) {
  'use strict'

  /**
   * Returns a miner for the given FP-Tree instance
   * @param {FpTree} fpTreeInstance - an instance of FpTree, having been filled with data
   */
  return function (fpTreeInstance) {
    const findPatterns = (query, threshold = 1) => {
      throw new Error('TODO')
      // 1. Given an existing FP-Tree (`fpTreeInstance`), and starting with
      //    a query that is an array of items (i.e. ['Endive'])
      //    1. For each item in the query, find the items that co-exist with it
      //       in `fpTreeInstance`
      //        1. Find the item by name, in fpTreeInstance's header table
      //           (i.e. `fpTreeInstance.headers.getHeader(name)`)
      //        2. If this item doesn't exist in the header table, skip it and
      //           move on to the next item in the query
      //        3. Else
      //            1. Get the nodes in `fpTreeInstance` that are associated
      //               with this item, via the header table
      //               (i.e. `fpTreeInstance.headers.getHeader(name).nodeLinks`)
      //            2. Get the items that co-exist with the nodes that were found in
      //               the header table. Traverse the parental hierarchy, not the
      //               child hierarchy, to return only the items that occurred more
      //               than the item we're searching for (requires recursion). i.e.:
      //
      //               const mapParentalHierarchy = (nodes) => {
      //                 if (!nodes[0].hasParent() || nodes[0].parent.name === 'root') {
      //                     // we reached an edge, return the graph
      //                     return nodes;
      //                 }
      //
      //                 nodes.unshift(nodes[0].parent);
      //                 return mapParentalHierarchy(nodes);
      //               };
      //
      //            3. Remove self from the results of recursion (i.e. if you always
      //               put the parent at the beginning of the array, you can `pop`
      //               the last item, which is self).
      //            4. Reduce the results to lists of items (shed the extraneous
      //               information about the nodes). The end result should resemble this:
      //
      //               [
      //                 { id: 0, items: [ 'Berries', 'Apples', 'Endive' ] },
      //                 { id: 1, items: [ 'Berries', 'Endive' ] },
      //                 { id: 2, items: [ 'Berries', 'Apples', 'Endive' ] },
      //                 { id: 3, items: [ 'Berries', 'Apples', 'Endive' ] }
      //               ]
      //    2. We should now have an array of arrays of transactions.
      //       i.e. Searching for Endive returns:
      //
      //       [
      //         [
      //           { id: 0, items: [ 'Berries', 'Apples', 'Endive' ] },
      //           { id: 1, items: [ 'Berries', 'Endive' ] },
      //           { id: 2, items: [ 'Berries', 'Apples', 'Endive' ] },
      //           { id: 3, items: [ 'Berries', 'Apples', 'Endive' ] }
      //         ],
      //         [...]
      //       ]
      //
      //       Merge the arrays of transactions into a single array of
      //       transactions to produce a single array instead of an array
      //       of arrays. i.e.:
      //
      //       [
      //         { id: 0, items: [ 'Berries', 'Apples', 'Endive' ] },
      //         { id: 1, items: [ 'Berries', 'Endive' ] },
      //         { id: 2, items: [ 'Berries', 'Apples', 'Endive' ] },
      //         { id: 3, items: [ 'Berries', 'Apples', 'Endive' ] }
      //       ]
      //
      //    3. Remove the items we are matching from the transactions. For
      //       instance, given the previous example where we searched for,
      //       "Endive", we would enumerate the transactions and remove "Endive"
      //       from all of them, resulting in this:
      //
      //       [
      //         { id: 0, items: [ 'Berries', 'Apples' ] },
      //         { id: 1, items: [ 'Berries' ] },
      //         { id: 2, items: [ 'Berries', 'Apples' ] },
      //         { id: 3, items: [ 'Berries', 'Apples' ] }
      //       ]
      //
      //    4. Remove any transactions that are empty after removing what
      //       we searched for (none would be removed from the previous example
      //       because all transactions still have at least one item in them)
      //    5. Construct a new instance of FpTree, using this filtered list of
      //       transactions as `data` argument. These data are our frequently
      //       occurring items, having grown in frequency by the number of
      //       times the same pattern occurs.
    }

    return { findPatterns }
  }
}
