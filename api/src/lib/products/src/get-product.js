/**
 * @param {ProductPgRepo} productRepo
 */
function GetProductFactory (deps) {
  'use strict'

  const { productRepo } = deps

  /**
   * Get a product by uid
   *
   * Usage with httpie:
   *     http http://localhost:3000/products/before_go
   */
  const getProduct = async (ctx) => {
    const logger = ctx.request.state.logger

    try {
      const product = await productRepo.get.byUid(ctx.params.uid)

      if (product) {
        logger.emit('product_read_success', 'debug', { uid: ctx.params.uid, product })
        logger.emit('product_read_success', 'audit_info', { affectedProductId: product.id })

        ctx.response.status = 200
        ctx.response.body = product
      } else {
        ctx.response.status = 404
      }
    } catch (err) {
      logger.emit('product_read_error', 'error', { err })
      throw new Error('Failed to read product with uid ' + ctx.params.uid)
    }
  }

  return { getProduct }
}

module.exports = GetProductFactory
