/**
 * @param {@polyn/blueprint} blueprint
 * @param {@polyn/immutable} immutable
 * @param {uuid/v4} uuid
 */
function ProductFactory (deps) {
  'use strict'

  const { registerBlueprint, optional } = deps.blueprint
  const { immutable } = deps.immutable
  const { uuid } = deps

  const REGEX = {
    UUID: /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    PRODUCT_TYPE: /^(book|magazine|movie)$/,
  }

  const ProductBlueprint = {
    id: optional(REGEX.UUID).withDefault(uuid),
    uid: 'string',
    title: 'string',
    description: 'string',
    price: 'decimal:2',
    thumbnailHref: 'string',
    type: REGEX.PRODUCT_TYPE,
    metadata: 'object',
  }

  registerBlueprint('Product', ProductBlueprint)
  const Product = immutable('Product', ProductBlueprint)
  Product.blueprint = ProductBlueprint

  return { Product }
}

module.exports = ProductFactory
