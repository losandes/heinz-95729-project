const blueprint = require('@polyn/blueprint')
const immutable = require('@polyn/immutable')
const path = require('path')
const uuid = require('uuid').v4
const { Order } = require('./src/Order.js')({ blueprint, immutable, uuid })
const { OrderPgRepo } = require('./src/OrderPgRepo.js')({ blueprint, Order })
const FindOrderFactory = require('./src/find-orders.js')
const MigrateOrderFactory = require('./migrate.js')

/**
 * @param {knex} knex - A configured/initialized instance of knex
 */
function OrderFactory (input) {
  const orderRepo = new OrderPgRepo({ knex: input.knex })
  const { findOrder } = new FindOrderFactory({ orderRepo })
  const migrate = MigrateOrderFactory({ path, knex: input.knex })

  return {
    Order,
    orderRepo,
    findOrder,
    migrate,
  }
}

module.exports = OrderFactory
