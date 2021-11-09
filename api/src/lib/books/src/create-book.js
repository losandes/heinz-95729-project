/**
 * @param {Book} Book
 * @param {BookPgRepo} productRepo
 */
function CreateBookFactory (deps) {
  'use strict'

  const { Book, productRepo } = deps

  /**
   * Create a book
   *
   * Usage with httpie:
   *     http POST http://localhost:3000/books <<< '{ "title": "This Is Where I Leave You: A Novel", "uid": "where_i_leave_you", "description": "The death of Judd Foxman'"'"'s father marks the first time that the entire Foxman clan has congregated in years. There is, however, one conspicuous absence: Judd'"'"'s wife, Jen, whose affair with his radio- shock-jock boss has recently become painfully public. Simultaneously mourning the demise of his father and his marriage, Judd joins his dysfunctional family as they reluctantly sit shiva-and spend seven days and nights under the same roof. The week quickly spins out of control as longstanding grudges resurface, secrets are revealed and old passions are reawakened. Then Jen delivers the clincher: she'"'"'s pregnant.", "metadata": { "authors": [{ "name": "Jonathan Tropper" }], "keywords": ["funeral", "death", "comedy"] }, "price": 7.99, "thumbnailHref": "https://m.media-amazon.com/images/I/81hvdUSsatL._AC_UY436_QL65_.jpg", "type": "book" }'
   */
  const createBook = async (ctx) => {
    const logger = ctx.request.state.logger
    let product

    try {
      if (ctx.request.body && ctx.request.body.id) {
        // don't let the client set the id
        delete ctx.request.body.id
      }

      product = new Book(ctx.request.body)
    } catch (err) {
      logger.emit('product_upsert_invalid', 'warn', { err })
      ctx.response.status = 400
      ctx.response.body = { error: err.message }
      return
    }

    try {
      const { recordsAffected } = await productRepo.upsert(product)

      logger.emit('product_upsert_success', 'info', { affectedProductId: product.id, product: recordsAffected })
      logger.emit('product_upsert_success', 'audit_info', { product })
      ctx.response.status = 201
      ctx.response.body = product
    } catch (err) {
      logger.emit('product_upsert_error', 'error', { err })
      ctx.response.status = 500
      ctx.response.body = { error: 'An error occurred while attempting to write the data' }
    }
  }

  return { createBook }
}

module.exports = CreateBookFactory
