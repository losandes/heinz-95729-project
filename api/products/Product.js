/*
// See the README.md for info on this module
*/
module.exports.name = 'Product'
module.exports.dependencies = ['@polyn/blueprint', '@polyn/immutable', 'ObjectID', 'logger']
module.exports.factory = function (_blueprint, _immutable, ObjectID, logger) {
  'use strict'

  const { optional } = _blueprint
  const { immutable } = _immutable
  const productBp = {
    _id: optional('string')
      .from(({ value }) => value ? new ObjectID(value).toString() : null)
      .withDefault(new ObjectID().toString()),
    uid: 'string',
    title: 'string',
    description: 'string',
    metadata: {
      keywords: 'string[]?'
    },
    price: 'decimal:2',
    thumbnailLink: 'string',
    type: 'string'
  }

  /**
   * This is the Product constructor, which will be returned by this factory.
   * It uses @polyn/immutable, which accepts a @polyn/blueprint argument.
   * When being constructed, the input is validated automatically.
   */
  const Product = immutable('Product', productBp)
  Product.blueprint = Object.freeze(productBp)
  Object.freeze(Product.blueprint.metadata)

  /*
    // The db object is used to create and connect to the appropriate database
    // collection, which is similar to a table in relational storage.
    */
  Product.db = {
    // This is the name of the collection
    collection: 'products',
    // The indexes improve query performance
    indexes: [
      // This index enforces a unique uid, it allows multiple nulls
      // (sparse: true), although the Product model requires the uid property,
      // so a null should never be present.
      {
        keys: { name: 1 },
        options: { name: 'unq.products.uid', unique: true, sparse: true }
      },
      // This is the full-text index, which is used for searching
      // '$**' indicates that all text properties should be included
      // in the index. We allow this to process in the background,
      // for performance reasons.
      {
        keys: { '$**': 'text' },
        options: { name: 'idx.products.$text', background: true }
      },
      // Because we may filter our queries by product type, we index
      // the type property. We allow this to process in the background,
      // for performance reasons.
      {
        keys: { type: 1 },
        options: { name: 'unq.products.type', background: true }
      }
    ]
  }

  return Product
}
