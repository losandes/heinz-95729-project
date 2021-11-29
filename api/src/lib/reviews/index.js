const blueprint = require('@polyn/blueprint')
const immutable = require('@polyn/immutable')
const path = require('path')
const uuid = require('uuid').v4
const { Review } = require('./src/Review.js')({ blueprint, immutable, uuid })
const { ReviewPgRepo } = require('./src/ReviewPgRepo.js')({ blueprint, Review })
const GetReviewsFactory = require('./src/get-reviews.js')
const CreateReviewFactory = require('./src/create-review.js')
const MigrateReviewsFactory = require('./migrate.js')

/**
 * @param {knex} knex - A configured/initialized instance of knex
 */
function ReviewsFactory (input) {
  const reviewRepo = new ReviewPgRepo({ knex: input.knex })
  const { getReviews } = new GetReviewsFactory({ reviewRepo })
  const { createReview } = new CreateReviewFactory({ Review, reviewRepo })
  const migrate = MigrateReviewsFactory({ path, knex: input.knex })

  return {
    Review,
    reviewRepo,
    getReviews,
    createReview,
    migrate,
  }
}

module.exports = ReviewsFactory
