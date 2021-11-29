/**
 * @param {@polyn/blueprint} blueprint
 * @param {@polyn/immutable} immutable
 */
function CartFactory (deps) {
  'use strict'

  const { registerBlueprint } = deps.blueprint
  const { immutable } = deps.immutable

    const cartBlueprint = {
    id: 'string',
    userid: 'string',
    productid: 'string'
  }

  registerBlueprint('cart', cartBlueprint)
    const cart = immutable('cart', cartBlueprint)
    cart.blueprint = cartBlueprint

    return { cart }
}

module.exports = CartFactory
