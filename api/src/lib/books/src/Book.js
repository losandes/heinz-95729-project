/**
 * @param {@polyn/blueprint} blueprint
 * @param {@polyn/immutable} immutable
 * @param {Product} Product
 */
function BookFactory (deps) {
  'use strict'

  const { registerBlueprint } = deps.blueprint
  const { immutable } = deps.immutable
  const { Product } = deps

  registerBlueprint('Author', {
    name: 'string',
  })

  const BookBlueprint = Product.blueprint
  BookBlueprint.metadata = {
    authors: 'object[]',
    keywords: 'string[]?',
  }

  registerBlueprint('Book', BookBlueprint)
  const Book = immutable('Book', BookBlueprint)
  Book.blueprint = BookBlueprint

  return { Book }
}

module.exports = BookFactory
