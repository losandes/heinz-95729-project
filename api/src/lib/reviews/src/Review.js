/**
 * @param {@polyn/blueprint} blueprint
 * @param {@polyn/immutable} immutable
 * @param {uuid/v4} uuid
 */
function ReviewFactory (deps) {
  'use strict'

  const { registerBlueprint, optional } = deps.blueprint
  const { immutable } = deps.immutable
  const { uuid } = deps

  const REGEX = {
    UUID: /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    RATING: /^(1|2|3|4|5)$/,
  }

  const ReviewBlueprint = {
    id: optional(REGEX.UUID).withDefault(uuid),
    user_id: 'string',
    book_id: 'string',
    rating: REGEX.RATING,
    description: 'string',
  }

  registerBlueprint('Review', ReviewBlueprint)
  const Review = immutable('Review', ReviewBlueprint)
  Review.blueprint = ReviewBlueprint

  return { Review }
}

module.exports = ReviewFactory
