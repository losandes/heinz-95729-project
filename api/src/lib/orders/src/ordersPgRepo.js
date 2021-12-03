/**
 * @param {@polyn/blueprint} blueprint
 * @param {orders} orders
 */
var moment = require('moment');

function ordersPgRepoFactory (deps) {
  'use strict'

    const { orders } = deps
  const { is } = deps.blueprint

  /**
   * @param {pg/Pool} db - The Pool function from pg
   */
    function ordersPgRepo (input) {
    const { knex } = input

    /**
     * Inserts or updates a product in the database
     * @param {Icart} input - an instance of Product to upsert
     */
        const upsert = async (input) => {
            var time = moment().format('YYYY-MM-DD hh:mm:ss')
      const res = await knex.transaction(async (trx) => {
          const res1 = await trx('orders')
              .insert({
                  id: input.id,
              userid: input.userid,
              productids: input.productids,
                  totalprice: parseFloat(input.totalprice),
                  purchasedate: time
          })
          .onConflict('id')
          .merge([
            'userid',
              'productids',
              'totalprice'
          ])



        return { res1 }
      })



        return { res: res.res1 }
    }

        const ordersById = async (userid) => {
            const results = await knex('orders').where('userid', userid)
            return results
        }
        const products = async (id) => {
            const results = await knex('products').whereIn('id', id)
            return results
        }
    return {
        upsert,
        get: {
            byId: ordersById,
            prod: products
        }
    }
  }

    return { ordersPgRepo }
}

module.exports = ordersPgRepoFactory
