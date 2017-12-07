module.exports.name = 'FpNode'
module.exports.dependencies = []
module.exports.factory = () => {
  'use strict'

  /**
   * Each object in a tree structure is a `node`. For this FP Tree, each
   * node has information about the object that can be used when sorting,
   * navigating, and mining the FP Tree.
   * @param {Object} node - the node
   */
  return function Node (node) {
    var self = {
      id: `${node.name}(${node.groupId})`,
      groupId: node.groupId,
      name: node.name,
      count: 1,
      parent: node.parent,
      children: {},
      toString: function() {
        return node.groupId + "," + node.name
      }
    }

    /**
     * Get a child by name
     * @param {string} name - the name of the child
     */
    self.getChild = (name) => {
      return self.children[name]
    }

    /**
     * Check if this node has a child with the given name
     * @param {string} name - the name of the child
     */
    self.hasChild = (name) => {
      return self.getChild(name) !== undefined
    }

    /**
     * Count the number of children this node has
     */
    self.countChildren = () => {
      return Object.keys(self.children).length
    }

    /**
     * Check whether or not this node is the child of another node
     */
    self.hasParent = () => {
      return self.parent !== undefined && self.parent !== null
    }

    /**
     * Check whether or not this node is an edge (has no children)
     */
    self.isEdge = () => {
      return self.countChildren() === 0
    }

    /**
     * Increment the count of a child with the given name by 1
     * @param {string} name - the name of the child
     */
    self.incrementChild = (name) => {
      self.getChild(name).count += 1
      return self.getChild(name)
    }

    /**
     * If a child with the same name exists, increment it's count by 1
     * else create a new Child with:
     *   * its count initialized to 1
     *   * its parent link linked to this Item,
     *   * the following is done when creating the headers:
     *          (and its node-link linked to the nodes with the same item-name via the node-link structure)
     */
    self.addOrIncrementChild = (child) => {
      if (self.hasChild(child.name)) {
        self.incrementChild(child.name)
      } else {
        self.children[child.name] = new Node({
          groupId: child.groupId,
          name: child.name,
          parent: self
        })
      }

      return self.getChild(child.name)
    }

    return self
  }
} // /Factory
