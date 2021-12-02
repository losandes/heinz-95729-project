/**
 * @param {@polyn/blueprint} blueprint
 * @param {@polyn/immutable} immutable
 */
function CartFactory (deps) {
  'use strict'

    const { registerBlueprint, optional} = deps.blueprint
    const { immutable } = deps.immutable
    const { uuid } = deps
    const REGEX = {
        UUID: /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        PRODUCT_TYPE: /^(cart)$/,
    }
    const cartBlueprint = {
        id: optional(REGEX.UUID).withDefault(uuid),
    userid: 'string',
    productid: 'string'
  }

  registerBlueprint('cart', cartBlueprint)
    const cart = immutable('cart', cartBlueprint)
    cart.blueprint = cartBlueprint

    return { cart }
}

module.exports = CartFactory
