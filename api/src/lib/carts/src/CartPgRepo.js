/**
 * @param {Cart} Cart
 */
function CartPgRepoFactory (deps) {
  'use strict'

  const { Cart } = deps

  /**
   * @param {pg/Pool} db - The Pool function from pg
   */
  function CartPgRepo (input) {
    const { knex } = input

    /**
     * Inserts or updates a product in the cart
     * @param {ICart} input - an instance of Cart to upsert
     */
    const upsert = async (input) => {
      const cart = new Cart(input)
      const res = await knex.transaction(async (trx) => {
        return trx('carts')
          .insert({
            id: cart.id,
            product_id: cart.product_id,
            quantity: cart.quantity,
            time_added_ms: Date.now(),
          })
          .onConflict('id')
          .merge([
            'product_id',
            'quantity',
          ])
      })

      if (res.rowCount !== 1) {
        const err = new Error('The number of operations to upsert a record was not expected')
        err.data = res
      }

      return { cart, res }
    }

    const mapResults = (results) => results.map((record) => new Cart({
      id: record.id,
      product_id: record.product_id,
      quantity: record.quantity,
    }))

    /**
     * Gets a product in the cart by id
     * @param {string} id - the id of the product in the cart to get
     * @returns {ICart | null} - an instance of Cart if a record was found, otherwise null
     */
    const productByUserId = async (id) => {
      const results = mapResults(await knex('carts').where('id', id))

      return results.length ? results[0] : null
    }


        /**
     * Gets a product in the cart by userId
     * @param {string} userId - the user Id of the user to get the product in the cart
     * @returns {ICart | null} - an instance of Cart if a record was found, otherwise null
     */
        const productById = async (userId) => {
          const results = mapResults(await knex('carts').where('userId', userId))
    
          return results.length ? results[0] : null
        }


    /**
     * Removes a product from the cart by id
     * @param {string} id - the id of the product in the cart to remove
     * @returns {boolean} - whether or not the record was deleted
     */
    const deleteById = async (id) => {
      const count = await knex('carts').where('id', id).del()

      return count > 0
    }

    return {
      upsert,
      get: {
        byId: productById,
      },
      delete: {
        byId: deleteById,
      },
    }
  }

  return { CartPgRepo }
}

module.exports = CartPgRepoFactory
