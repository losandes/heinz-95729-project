/**
 * @param {@polyn/blueprint} blueprint
 * @param {Review} Review
 */
function ReviewPgRepoFactory (deps) {
  'use strict'

  const { Review } = deps
  // const { is } = deps.blueprint

  /**
   * @param {pg/Pool} db - The Pool function from pg
   */
  function ReviewPgRepo (input) {
    const { knex } = input

    /**
     * Inserts or updates a review in the database
     * @param {IReview} input - an instance of Product to upsert
     */
    const upsert = async (input) => {
      const review = new Review(input)
      const res = await knex.transaction(async (trx) => {
        const res1 = await trx('reviews')
          .insert({
            id: review.id,
            user_id: review.user_id,
            book_id: review.book_id,
            rating: review.rating,
            description: review.description,
          })
          .onConflict('id')
          .merge([
            'user_id',
            'book_id',
            'rating',
            'description',
          ])
        return { res1 }
      })

      if (res.res1.rowCount !== 1) {
        const err = new Error('The number of operations to upsert a record was not expected')
        err.data = res
      }

      return { review, res: res.res1 }
    }

    const mapResults = (results) => results.map((record) => new Review({
      id: record.id,
      user_id: record.user_id,
      book_id: record.book_id,
      rating: record.rating,
      description: record.description,
    }))

    /**
     * Gets a Product by id
     * @param {string} id - the ID of the products to get (i.e. `e0ed9bc0-6e4c-4d7f-9d98-46714ffa357c`)
     * @returns {IProduct | null} - an instance of Product if a record was found, otherwise null
     */
    const getReviews = async (bookId) => {
      const results = mapResults(await knex('reviews').where('book_id', bookId))

      return results.length ? results : []
    }

    /**
     * Deletes a Product by id
     * @param {string} id - the ID of the products to delete (i.e. `e0ed9bc0-6e4c-4d7f-9d98-46714ffa357c`)
     * @returns {boolean} - whether or not the record was deleted
     */
    const deleteById = async (id) => {
      const count = await knex('reviews').where('id', id).del()

      return count > 0
    }

    return {
      upsert,
      get: {
        bookReviews: getReviews,
      },
      delete: {
        byId: deleteById,
      },
    }
  }

  return { ReviewPgRepo }
}

module.exports = ReviewPgRepoFactory
