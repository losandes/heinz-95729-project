/**
 * @param {@polyn/blueprint} blueprint
 * @param {@polyn/immutable} immutable
 */
function OrdersFactory (deps) {
  'use strict'

  const { registerBlueprint } = deps.blueprint
  const { immutable } = deps.immutable

    const ordersBlueprint = {
    id: 'string',
    userid: 'string',
        productids: 'string',
        totalprice:'string'
  }

    registerBlueprint('orders', ordersBlueprint)
    const orders = immutable('orders', ordersBlueprint)
    orders.blueprint = ordersBlueprint

    return { orders }
}

module.exports = OrdersFactory
