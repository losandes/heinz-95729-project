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
  const completeOrder = async (ctx) => {
    const logger = ctx.request.state.logger
    const userOrders = ctx.request.body.orders

    try {
      // Use the orderRepo to insert or update the product in the cart
      const { orders, res } = await orderRepo.upsert(userOrders)
      // Clear Cart for the specified user
      const deleted = await cartRepo.delete.byUserId(body.userId)

      logger.emit('Order_upsert_success', 'debug', { orders, res })

      ctx.response.status = 200
      ctx.response.body = { ordersAdded: true }
    } catch (err) {
      logger.emit('Order_upsert_error', 'error', { err })
      throw new Error('Failed to add product to order')
    }
  }

  return { completeOrder }
}

module.exports = AddToOrderFactory
