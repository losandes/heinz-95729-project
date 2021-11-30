/**
 * @param {ProductPgRepo} productRepo
 */
function FindProductFactory (deps) {
  'use strict'

  const { productRepo } = deps

  /**
   * Get a product by id
   *
   * Usage with httpie:
   *     http http://localhost:3000/products?q=Tropper
   */
  const findProduct = async (ctx) => {
    const logger = ctx.request.state.logger

    try {
      const products = await productRepo.find(ctx.query.q)

      logger.emit('product_find_success', 'debug', { count: products.length, products })

      ctx.response.status = 200
      ctx.response.body = products
    } catch (err) {
      logger.emit('product_find_error', 'error', { err })
      throw new Error('Failed to find product with query ' + ctx.query.q)
    }
  }

  return { findProduct }
}

module.exports = FindProductFactory
