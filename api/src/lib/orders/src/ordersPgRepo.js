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
      const res = await knex.transaction(async (trx) => {
          const res1 = await trx('orders')
              .insert({
              id: moment().format('yyyy-mm-dd:hh:mm:ss'),
              userid: input.userid,
              productids: input.productids,
              totalprice: input.totalprice
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
    return {
        upsert,
        get: {
            byId: ordersById,
        }
    }
  }

    return { ordersPgRepo }
}

module.exports = ordersPgRepoFactory
