/**
 * @param {CartPgRepo} CartRepo
 */
function RemoveProductFactory (deps) {
  'use strict'

  const { CartRepo } = deps

  /**
   * Removes a product from the cart
   * @param {Object} ctx - the context object containing the ID of the product to remove from the cart
   */
  const RemoveProduct = async (ctx) => {
    const logger = ctx.request.state.logger
    const productId = ctx.request.params.id

    try {
      // Use the CartRepo to delete the product from the cart
      const result = await CartRepo.delete.byId(productId)

      logger.emit('Cart_delete_success', 'debug', { result })

      ctx.response.status = 200
      ctx.response.body = result
    } catch (err) {
      logger.emit('Cart_delete_error', 'error', { err })
      throw new Error('Failed to remove product from cart')
    }
  }

  return { RemoveProduct }
}

module.exports = RemoveProductFactory
