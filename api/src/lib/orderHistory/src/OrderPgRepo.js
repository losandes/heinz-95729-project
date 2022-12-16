/**
 * @param {@polyn/blueprint} blueprint
 * @param {Order} Order
 */
function OrderPgRepoFactory (deps) {
  'use strict'

  const { Order } = deps

  /**
   * @param {pg/Pool} db - The Pool function from pg
   */
  function OrderPgRepo (input) {
    const { knex } = input

    /**
     * Inserts or updates a product in the database
     * @param {IOrder} input - an instance of Order to upsert
     */
    const upsert = async (input) => {
      const orders = input.map(product => new Order(product))
      console.log("********************************************")
      console.log(orders);
      const res = await knex.transaction(async (trx) => {
         return trx('orderhistory')
          .insert(orders)
          .onConflict('id')
          .merge([
            'userid',
            'productid',
          ])
      })

      return { orders, res }

    }

    const mapResults = (results) => results.map((record) => new Order({
      id: record.id,
      productId: record.productid,
      userId: record.userid,
      transactionId: record.transactionid,
      title: record.title,
      thumbnailHref: record.thumbnail_href,
      price: record.price,
    }))

    /**
     * Gets a Order by id
     * @param {string} id - the ID of the Orders to get (i.e. `e0ed9bc0-6e4c-4d7f-9d98-46714ffa357c`)
     * @returns {IOrder | null} - an instance of Orders if a record was found, otherwise null
     */
    const orderById = async (id) => {
      const results = mapResults(await knex('orderhistory').where('id', id))
      return results.length ? results : null
    }

    /**
     * Gets a Order by userId
     * @param {string} userId - the userId of the Order to get (i.e. `before_go`)
     * @returns {IOrder | null} - an instance of Order if a record was found, otherwise null
     */
    const orderByUserId = async (userId) => {
      const results = mapResults(await knex('orderhistory').join('products', 'products.uid', 'orderhistory.productid')
          .where('userid', userId))
      return results && results.length ? results : null
    }

    // eslint-disable-next-line no-useless-escape
    const tokenize = (phrase) => phrase.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .replace(/\s{2,}/g, ' ')
      .split(' ')

    /**
     * Find products by search words or phrases
     * Read about tsquery
     * -   [Mastering PostgreSQL Tools: Full-Text Search and Phrase Search](https://compose.com/articles/mastering-postgresql-tools-full-text-search-and-phrase-search/)
     * -   [Indexing for full text search in PostgreSQL](https://www.compose.com/articles/indexing-for-full-text-search-in-postgresql/)
     * -   [The json(b)_to_tsvector function](https://www.depesz.com/2018/04/23/waiting-for-postgresql-11-add-jsonb_to_tsvector-function/)
     * -   [Setting up PostgreSQL Full Text Search: 3 Critical Steps](https://hevodata.com/blog/postgresql-full-text-search-setup/)
     * -   [Trigrams and Text Search](https://www.postgresql.org/docs/11/pgtrgm.html)
     * -   [Full-text and phrase search in PostgreSQL](https://coletiv.com/blog/full-text-and-phrase-search-in-postgresql/)
     * @param {string} search - the word or phrase to search for
     * @returns {IOrder[]} - an array of Products
     */
   /* const find = async (query) => {
      if (is.not.string(query)) {
        return []
      }

      return mapResults(await knex('orderhistory')
        .whereRaw(
          'vectors @@ to_tsquery(:query)',
          {
            query: tokenize(query).join(' | '), // or `.join(' & ')`, `.join(' <-> ')`, etc.
          },
        ),
      )
    }*/

    /**
     * Deletes a Product by id
     * @param {string} id - the ID of the products to delete (i.e. `e0ed9bc0-6e4c-4d7f-9d98-46714ffa357c`)
     * @returns {boolean} - whether or not the record was deleted
     */
    const deleteById = async (id) => {
      const count = await knex('orderhistory').where('id', id).del()

      return count > 0
    }

    return {
      upsert,
      get: {
        byId: orderById,
        byUserId: orderByUserId,
      },
     // find,
      delete: {
        byId: deleteById,
      },
    }
  }

  return { OrderPgRepo }
}

module.exports = OrderPgRepoFactory



