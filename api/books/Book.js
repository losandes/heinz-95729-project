/*
// See the README.md for info on this module
*/
module.exports.name = 'Book'
module.exports.dependencies = ['@polyn/blueprint', '@polyn/immutable', 'Product', 'logger']
module.exports.factory = function (_blueprint, _immutable, Product, logger) {
  'use strict'

  const { registerBlueprint } = _blueprint
  const { immutable } = _immutable

  registerBlueprint('Author', {
    name: 'string'
  })

  const Book = immutable('book', {
    // Inherit/Extend Product
    ...Product.blueprint,
    ...{
      metadata: {
        // Inherit Product.metadata
        ...Product.blueprint.metadata,
        // extend Product.metadata with a required array of authors
        ...{
          authors: 'Author[]'
        }
      }
    }
  })

  return Book
}
