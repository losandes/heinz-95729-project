/**
 * @param {@polyn/blueprint} blueprint
 * @param {@polyn/immutable} immutable
 */
function OrdersFactory (deps) {
  'use strict'

    const { registerBlueprint, optional } = deps.blueprint
  const { immutable } = deps.immutable
    const { uuid } = deps
    const REGEX = {
        UUID: /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
        PRODUCT_TYPE: /^(orders)$/,
    }
    const ordersBlueprint = {
        id: optional(REGEX.UUID).withDefault(uuid),
    userid: 'string',
        productids: 'string',
        totalprice: 'string',
        purchasedate:'string'
  }

    registerBlueprint('orders', ordersBlueprint)
    const orders = immutable('orders', ordersBlueprint)
    orders.blueprint = ordersBlueprint

    return { orders }
}

module.exports = OrdersFactory
