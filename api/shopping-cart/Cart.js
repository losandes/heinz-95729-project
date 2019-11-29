/*
// See the README.md for info on this module
*/
module.exports.name = 'Cart'
module.exports.dependencies = ['@polyn/blueprint', '@polyn/immutable', 'ObjectID']
module.exports.factory = function (_blueprint, _immutable, ObjectID) {
  'use strict'

  const { optional } = _blueprint
  const { immutable } = _immutable
  const cartBp = {
    _id: optional('string')
      .from(({ value }) => value ? new ObjectID(value).toString() : null)
      .withDefault(new ObjectID().toString()),
    uid: 'string',
    items: {
      keywords: 'object[]?'
    },
    total: optional('decimal').withDefault(0.00),
  }

  /**
   * This is the Cart constructor, which will be returned by this factory.
   * It uses @polyn/immutable, which accepts a @polyn/blueprint argument.
   * When being constructed, the input is validated automatically.
   */
  const Cart = immutable('Cart', cartBp)
  Cart.blueprint = Object.freeze(cartBp)
  Object.freeze(Cart.blueprint.items)

  /*
    // The db object is used to create and connect to the appropriate database
    // collection, which is similar to a table in relational storage.
    */
  Cart.db = {
    // This is the name of the collection
    collection: 'carts',
    // The indexes improve query performance
    indexes: [
      // This index enforces a unique uid, it allows multiple nulls
      // (sparse: true), although the Cart model requires the uid property,
      // so a null should never be present.
      {
        keys: { name: 1 },
        options: { name: 'unq.carts.uid', unique: true, sparse: true }
      },
    ]
  }

  return Cart
}
