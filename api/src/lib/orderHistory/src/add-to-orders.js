/**
 * @param {OrderPgRepo} OrderRepo
 */
function AddToOrderFactory (deps) {
  'use strict'

  const { orderRepo,cartRepo } = deps

  /**
   * Adds a product to a cart
   * @param {Object} ctx - the context object containing the product information to add to the cart
   */
  const addToOrder = async (ctx) => {
    const logger = ctx.request.state.logger
    const product = ctx.request.body

    try {
      // Use the orderRepo to insert or update the product in the cart
      const { order, res } = await orderRepo.upsert(product)

      // Clear Cart for the specified user
      const { deleted } = await cartRepo.delete.byUserId(body.userId)

      logger.emit('Order_upsert_success', 'debug', { order, res })

      ctx.response.status = 200
      ctx.response.body = order
    } catch (err) {
      logger.emit('Order_upsert_error', 'error', { err })
      throw new Error('Failed to add product to order')
    }
  }

  return { addToOrder }
}

module.exports = AddToOrderFactory
