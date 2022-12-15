const blueprint = require('@polyn/blueprint')
const immutable = require('@polyn/immutable')
const uuid = require('uuid').v4
const { Cart } = require('./src/Cart.js')({ blueprint, immutable, uuid })
const { CartPgRepo } = require('./src/CartPgRepo.js')({ Cart })
const { AddToCart } = require('./src/add-to-cart.js')()
const { RemoveProduct } = require('./src/remove-product.js')()

/**
 * @param {knex} knex - A configured/initialized instance of knex
 */
function CartsFactory (input) {
  const cartRepo = new CartPgRepo({ knex: input.knex })
  const { addToCart } = new AddToCart({ cartRepo })
  const { removeProduct } = new RemoveProduct({ cartRepo })

  return {
    Cart,
    cartRepo,
    addToCart,
    removeProduct,
  }
}

module.exports = CartsFactory

