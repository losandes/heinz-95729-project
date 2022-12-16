/**
 * @param {CartPgRepo} CartRepo
 */
function RemoveCartFactory (deps) {
  'use strict'

  const { cartRepo } = deps

  /**
   * Adds a product to a cart
   * @param {Object} ctx - the context object containing the product information to add to the cart
   */
  const removeCart = async (ctx) => {
    const logger = ctx.request.state.logger
    const product = ctx.request.body

    try {
      // Use the CartRepo to insert or update the product in the cart
      const { cart, res } = await cartRepo.delete(product)

      logger.emit('Cart_delete_success', 'debug', { cart, res })

      ctx.response.status = 200
      ctx.response.body = cart
    } catch (err) {
      logger.emit('Cart_delete_error', 'error', { err })
      throw new Error('Failed to add product to cart')
    }
  }

  return { removeCart }
}

module.exports = RemoveCartFactory
