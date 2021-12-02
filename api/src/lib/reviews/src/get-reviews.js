/**
 * @param {ReviewPgRepo} reviewRepo
 */
function GetReviewFactory (deps) {
  'use strict'

  const { reviewRepo } = deps

  /**
   * Get a product by uid
   *
   * Usage with httpie:
   *     http http://localhost:3000/products/before_go
   */
  const getReviews = async (ctx) => {
    const logger = ctx.request.state.logger

    try {
      const review = await reviewRepo.get.bookReviews(ctx.params.book_id)

      if (review) {
        // logger.emit('review_read_success', 'debug', { uid: ctx.params.uid, review })
        // logger.emit('review_read_success', 'audit_info', { affectedProductId: review.id })

        ctx.response.status = 200
        ctx.response.body = review
      } else {
        ctx.response.status = 404
      }
    } catch (err) {
      logger.emit('review_read_error', 'error', { err })
      throw new Error('Failed to read review with book_id ' + ctx.params.book_id)
    }
  }

  return { getReviews }
}

module.exports = GetReviewFactory
