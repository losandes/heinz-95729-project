/**
 * @param {ProductPgRepo} productRepo
 */
function FindOrderFactory (deps) {
  'use strict'

  const { orderRepo } = deps

  /**
   * Get a Order by id
   *
   * Usage with httpie:
   *     http http://localhost:3000/findOrders?q=Tropper
   */
  const findOrder = async (ctx) => {
    const logger = ctx.request.state.logger

    try {
      const orders = await orderRepo.find(ctx.query.q)

      logger.emit('order_find_success', 'debug', { count: orders.length, orders })

      ctx.response.status = 200
      ctx.response.body = orders
    } catch (err) {
      logger.emit('order_find_error', 'error', { err })
      throw new Error('Failed to find orders with query ' + ctx.query.q)
    }
  }

  return { findOrder }
}

module.exports = FindOrderFactory
