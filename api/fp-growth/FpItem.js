module.exports.name = 'FpItem'
module.exports.dependencies = []
module.exports.factory = () => {
  /**
   * Each transaction includes an array of items that were purchased. This
   * model represents a single item in that array.
   * @param {any} groupId - usually the transaction ID, and usually a number, or a UUID
   * @param {string} name - the item (only primitives are supported)
   */
  return function Item (groupId, name) {
    var self = {
      id: `${name}(${groupId})`,
      groupId: groupId,
      name: name,
      count: 1
    }

    return self
  }
}
