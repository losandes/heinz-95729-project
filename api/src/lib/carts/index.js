const blueprint = require('@polyn/blueprint')
const immutable = require('@polyn/immutable')
const path = require('path')
const uuid = require('uuid').v4
const { Cart } = require('./src/Cart.js')({ blueprint, immutable, uuid })
const { CartPgRepo } = require('./src/CartPgRepo.js')({ blueprint, Cart })
const AddToCartFactory = require('./src/add-to-cart.js')
const RemoveProductFactory = require('./src/RemoveProduct.js')
const MigrateCartFactory = require('./migrate.js')

/**
 * @param {knex} knex - A configured/initialized instance of knex
 */
function CartsFactory (input) {
  const cartRepo = new CartPgRepo({ knex: input.knex })
  const { addToCart } = new AddToCartFactory({ cartRepo })
  const { removeProduct } = new RemoveProductFactory({ cartRepo })
  const migrate = MigrateCartFactory({ path, knex: input.knex })

  return {
    Cart,
    cartRepo,
    addToCart,
    removeProduct,
    migrate,
  }
}

module.exports = CartsFactory


