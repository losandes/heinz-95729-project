const blueprint = require('@polyn/blueprint')
const immutable = require('@polyn/immutable')
const path = require('path')
const uuid = require('uuid').v4
const { Order } = require('./src/Order.js')({ blueprint, immutable, uuid })
const { OrderPgRepo } = require('./src/OrderPgRepo.js')({ blueprint, Order })
const FindOrderFactory = require('./src/find-orders.js')
const CompleteOrderFactory = require('./src/add-to-orders.js')
const MigrateOrderFactory = require('./migrate.js')

/**
 * @param {knex} knex - A configured/initialized instance of knex
 */
function OrderFactory (input) {
  const orderRepo = new OrderPgRepo({ knex: input.knex })
  const { findOrders } = new FindOrderFactory({ orderRepo })
  const { completeOrder } = new CompleteOrderFactory({ orderRepo })
  const migrate = MigrateOrderFactory({ path, knex: input.knex })

  return {
    Order,
    orderRepo,
    findOrders,
    completeOrder,
    migrate,
  }
}

module.exports = OrderFactory
