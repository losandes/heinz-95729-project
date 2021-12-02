const path = require('path')
const blueprint = require('@polyn/blueprint')
const immutable = require('@polyn/immutable')
const uuid = require('uuid').v4
const { cart } = require('./src/cart.js')({ blueprint, immutable, uuid })
const CreateCartFactory  = require('./src/cart.js')({ blueprint, immutable })
const { cartPgRepo } = require('./src/cartPgRepo.js')({ blueprint, CreateCartFactory })
const GetcartFactory = require('./src/get-cart.js')
const UpsertcartFactory = require('./src/upsert-cart.js')
const DeletecartFactory = require('./src/delete-cart.js')
const MigrateCartFactory = require('./migrate.js')

module.exports = function (input) {

    const migrate = MigrateCartFactory({ path, knex: input.knex })
    const cartRepo = new cartPgRepo({ knex: input.knex })
    const { getCart } = new GetcartFactory({ cartRepo })
    const { upsertCart } = new UpsertcartFactory({ cart,cartRepo })
    const { deleteCart } = new DeletecartFactory({ cartRepo })
  return {
      CreateCartFactory,
      getCart,
      cartRepo,
      migrate,
      upsertCart,
      deleteCart
  }
}
