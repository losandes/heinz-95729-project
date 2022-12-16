/**
 * @param {CartPgRepo} CartRepo
 */
function RemoveCartFactory (deps) {
  'use strict'

  const { cartRepo } = deps

  /**
   * Removes a product to a cart
   * @param {Object} ctx - the context object containing the product information to add to the cart
   */
  const removeProduct = async (ctx) => {
    const logger = ctx.request.state.logger
    const body = ctx.request.body

    try {
      // Use the CartRepo to delete the product in the cart
      const { deleted } = await cartRepo.delete.byId(body.userId, body.productId)

      logger.emit('Cart_delete_success', 'debug', { deleted })

      ctx.response.status = 200
      ctx.response.body = { deleted }
    } catch (err) {
      logger.emit('Cart_delete_error', 'error', { err })
      throw new Error('Failed to add product to cart')
    }
  }

  return { removeProduct }
}

module.exports = RemoveCartFactory
