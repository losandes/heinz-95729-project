const path = require('path')
const blueprint = require('@polyn/blueprint')
const immutable = require('@polyn/immutable')
const uuid = require('uuid').v4
const { orders } = require('./src/orders.js')({ blueprint, immutable, uuid })
const CreateOrdersFactory  = require('./src/orders.js')({ blueprint, immutable })
const { ordersPgRepo } = require('./src/ordersPgRepo.js')({ blueprint, CreateOrdersFactory })
const GetordersFactory = require('./src/get-orders.js')
const UpsertordersFactory = require('./src/upsert-orders.js')
const MigrateOrdersFactory = require('./migrate.js')

module.exports = function (input) {

    const migrate = MigrateOrdersFactory({ path, knex: input.knex })
    const ordersRepo = new ordersPgRepo({ knex: input.knex })
    const { getOrders } = new GetordersFactory({ ordersRepo })
    const { upsertOrders } = new UpsertordersFactory({ orders, ordersRepo })
  return {
      CreateOrdersFactory,
      getOrders,
      migrate,
      upsertOrders,
  }
}
