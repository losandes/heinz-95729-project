/**
 * @param {Review} Review
 * @param {ReviewPgRepo} reviewRepo
 */
function CreateReviewFactory (deps) {
  'use strict'

  const { Review, reviewRepo } = deps

  /**
   * Create a review
   */
  const createReview = async (ctx) => {
    const logger = ctx.request.state.logger
    let review

    try {
      if (ctx.request.body && ctx.request.body.id) {
        // don't let the client set the id
        delete ctx.request.body.id
      }

      review = new Review(ctx.request.body)
    } catch (err) {
      logger.emit('review_upsert_invalid', 'warn', { err })
      ctx.response.status = 400
      ctx.response.body = { error: err.message }
      return
    }

    try {
      const { recordsAffected } = await reviewRepo.upsert(review)

      logger.emit('review_upsert_success', 'info', { affectedProductId: review.id, review: recordsAffected })
      logger.emit('review_upsert_success', 'audit_info', { review })
      ctx.response.status = 201
      ctx.response.body = review
    } catch (err) {
      logger.emit('review_upsert_error', 'error', { err })
      ctx.response.status = 500
      ctx.response.body = { error: 'An error occurred while attempting to write the data' }
    }
  }

  return { createReview }
}

module.exports = CreateReviewFactory
