/**
 * @param {CartPgRepo} cartRepo
 */
function GetCartFactory (deps) {
  'use strict'

  const { cartRepo } = deps

  /**
   * Get a Order by id
   *
   * Usage with httpie:
   *     http http://localhost:3000/findOrders?q=Tropper
   */
  const getCart = async (ctx) => {
    const logger = ctx.request.state.logger

    try {
      const carts = await cartRepo.get.byId(ctx.params.uid)

      logger.emit('order_find_success', 'debug', { count: carts.length, carts })

      ctx.response.status = 200
      ctx.response.body = carts
    } catch (err) {
      logger.emit('order_find_error', 'error', { err })
      throw new Error('Failed to find orders with query ' + ctx.query.q)
    }
  }

  return { getCart }
}

module.exports = GetCartFactory
