/**
 * You can use this to print FPTrees to the console,
 * for debugging and exploration
 */
module.exports.name = 'FpTreePrinter'
module.exports.dependencies = ['pretty-tree']
module.exports.factory = function Printer (generate) {
  function makeNodes (tree) {
    var node = {
      label: `${tree.name}: ${tree.count}`
    }

    const childKeys = Object.keys(tree.children)

    if (childKeys.length) {
      childKeys.forEach(key => {
        let child = tree.children[key]
        let grandchildKeys = Object.keys(child.children)

        if (grandchildKeys.length) {
          // the child also has children, recurse
          node.nodes = node.nodes || []
          node.nodes.push(makeNodes(child))
        } else {
          // the child is an edge, use a leaf instead of recursion
          node.leaf = node.leaf || {}
          node.leaf[child.name] = child.count
        }
      })
    }

    return node
  }

  return {
    print: (tree) => {
      console.log(generate(makeNodes(tree)))
    }
  }
}
