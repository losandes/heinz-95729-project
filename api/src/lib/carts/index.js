const blueprint = require('@polyn/blueprint')
const immutable = require('@polyn/immutable')
const path = require('path')
const uuid = require('uuid').v4
const stripe = require('stripe')("sk_test_51M2bQlFyvF0nfM8h4HnoPOyOjYHWvwHfOz8ewNOToT8K3D1upkleG49k8x9vrbRFnUrg6P9ovX8zz1oZ9EBvNLv900CFeBFReD");
const { Cart } = require('./src/Cart.js')({ blueprint, immutable, uuid })
const { CartPgRepo } = require('./src/CartPgRepo.js')({ blueprint, Cart })
const AddToCartFactory = require('./src/add-to-cart.js')
const GetCartFactory = require('./src/getCart.js')
const RemoveProductFactory = require('./src/RemoveProduct.js')
const StripeSessionFactory = require('./src/StripeSession.js')
const MigrateCartFactory = require('./migrate.js')

/**
 * @param {knex} knex - A configured/initialized instance of knex
 */
function CartsFactory (input) {
  const cartRepo = new CartPgRepo({ knex: input.knex })
  const { addToCart } = new AddToCartFactory({ cartRepo })
  const { getCart } = new GetCartFactory({ cartRepo })
  const { removeProduct } = new RemoveProductFactory({ cartRepo })
  const { stripeCheckoutSession } = new StripeSessionFactory({ stripe })
  const migrate = MigrateCartFactory({ path, knex: input.knex })

  return {
    Cart,
    cartRepo,
    addToCart,
    getCart,
    removeProduct,
    stripeCheckoutSession,
    migrate,
  }
}

module.exports = CartsFactory


