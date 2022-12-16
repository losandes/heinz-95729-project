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
            productid: cart.productId,
            userid: cart.userId,
            time_added_ms: Date.now(),
          })
          .onConflict('id')
          .merge([
            'productid',
            'userid',
          ])
      })

      if (res.rowCount !== 1) {
        const err = new Error('The number of operations to upsert a record was not expected')
        err.data = res
      }

      return { cart, res }
    }

    const mapResults = (results) => results.map((record) => ({
      id: record.id,
      productId: record.productid,
      userId: record.userid,
      title: record.title,
      thumbnailHref: record.thumbnail_href,
      price: record.price,
    }))

    /**
     * Gets a product in the cart by id
     * @param {string} id - the id of the product in the cart to get
     * @returns {ICart | null} - an instance of Cart if a record was found, otherwise null
     */
    // const productByUserId = async (id) => {
    //   const results = mapResults(await knex('carts').where('id', id))

    //   return results.length ? results[0] : null
    // }


        /**
     * Gets a product in the cart by userId
     * @param {string} userId - the user Id of the user to get the product in the cart
     * @returns {ICart | null} - an instance of Cart if a record was found, otherwise null
     */
      const productsByUserId = async (userId) => {
        const results = mapResults(await knex('carts')
          .join('products', 'products.uid', 'carts.productid')
          .where('userid', userId))
        return results.length ? results : null
      }


    /**
     * Removes a product from the cart by id
     * @param {string} userId - the id of the product in the cart to remove
     * @returns {boolean} - whether or not the record was deleted
     */
    const deleteById = async (userId,productId) => {
      const count = await knex('carts').where('productid', productId).andWhere('userid', userId).del()

      return count > 0
    }

    return {
      upsert,
      get: {
        byId: productsByUserId,
      },
      delete: {
        byId: deleteById,
      },
    }
  }

  return { CartPgRepo }
}

module.exports = CartPgRepoFactory
