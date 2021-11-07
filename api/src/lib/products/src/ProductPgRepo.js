/**
 * @param {@polyn/blueprint} blueprint
 * @param {Product} Product
 */
function ProductPgRepoFactory (deps) {
  'use strict'

  const { Product } = deps
  const { is } = deps.blueprint

  /**
   * @param {pg/Pool} db - The Pool function from pg
   */
  function ProductPgRepo (input) {
    const { knex } = input

    /**
     * Inserts or updates a product in the database
     * @param {IProduct} input - an instance of Product to upsert
     */
    const upsert = async (input) => {
      const product = new Product(input)
      const res = await knex.transaction(async (trx) => {
        const res1 = await trx('products')
          .insert({
            id: product.id,
            uid: product.uid,
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail_href: product.thumbnailHref,
            type: product.type,
            metadata: product.metadata,
            time_created_ms: Date.now(),
          })
          .onConflict('id')
          .merge([
            'title',
            'description',
            'price',
            'thumbnail_href',
            'type',
            'metadata',
          ])

        const res2 = await trx.raw(`UPDATE products SET vectors =
          (to_tsvector(title) || to_tsvector(description) || jsonb_to_tsvector('english', metadata, '["all"]'))
          WHERE id = :id;`, { id: product.id })

        return { res1, res2 }
      })

      if (res.res1.rowCount !== 1 || res.res2.rowCount !== 1) {
        const err = new Error('The number of operations to upsert a record was not expected')
        err.data = res
      }

      return { product, res: res.res1 }
    }

    const mapResults = (results) => results.map((record) => new Product({
      id: record.id,
      uid: record.uid,
      title: record.title,
      description: record.description,
      price: Number(record.price),
      thumbnailHref: record.thumbnail_href,
      type: record.type,
      metadata: record.metadata,
    }))

    /**
     * Gets a Product by id
     * @param {string} id - the ID of the products to get (i.e. `e0ed9bc0-6e4c-4d7f-9d98-46714ffa357c`)
     * @returns {IProduct | null} - an instance of Product if a record was found, otherwise null
     */
    const productById = async (id) => {
      const results = mapResults(await knex('products').where('id', id))

      return results.length ? results[0] : null
    }

    /**
     * Gets a Product by uid
     * @param {string} uid - the uid of the products to get (i.e. `before_go`)
     * @returns {IProduct | null} - an instance of Product if a record was found, otherwise null
     */
    const productByUid = async (uid) => {
      const results = mapResults(await knex('products').where('uid', uid))

      return results.length ? results[0] : null
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
     * @returns {IProduct[]} - an array of Products
     */
    const find = async (query) => {
      if (is.not.string(query)) {
        return []
      }

      return mapResults(await knex('products')
        .whereRaw(
          'vectors @@ to_tsquery(:query)',
          {
            query: tokenize(query).join(' | '), // or `.join(' & ')`, `.join(' <-> ')`, etc.
          },
        ),
      )
    }

    /**
     * Deletes a Product by id
     * @param {string} id - the ID of the products to delete (i.e. `e0ed9bc0-6e4c-4d7f-9d98-46714ffa357c`)
     * @returns {boolean} - whether or not the record was deleted
     */
    const deleteById = async (id) => {
      const count = await knex('products').where('id', id).del()

      return count > 0
    }

    return {
      upsert,
      get: {
        byId: productById,
        byUid: productByUid,
      },
      find,
      delete: {
        byId: deleteById,
      },
    }
  }

  return { ProductPgRepo }
}

module.exports = ProductPgRepoFactory
