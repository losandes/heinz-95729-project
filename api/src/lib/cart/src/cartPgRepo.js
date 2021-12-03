/**
 * @param {@polyn/blueprint} blueprint
 * @param {cart} cart
 */
var moment = require('moment');

function cartPgRepoFactory(deps) {
    'use strict'

    const { cart } = deps
    const { is } = deps.blueprint

    /**
     * @param {pg/Pool} db - The Pool function from pg
     */
    function cartPgRepo(input) {
        const { knex } = input

        /**
         * Inserts or updates a product in the database
         * @param {Icart} input - an instance of Product to upsert
         */
        const upsert = async (input) => {
            const res = await knex.transaction(async (trx) => {
                const res1 = await trx('cart')
                    .insert({
                        id: input.id,
                        userid: input.userid,
                        productid: input.productid
                    })
                    .onConflict('id')
                    .merge([
                        'userid',
                        'productid'
                    ])



                return { res1 }
            })



            return { res: res.res1 }
        }

        const cartById = async (userid) => {
            const results = await knex('cart').where('userid', userid)
            return results
        }
        const deleteById = async (id) => {
            const count = await knex('cart').where('id', id).del()

            return count > 0
        }
        const products = async (id) => {
            const results = await knex('products').whereIn('id', id)
            return results
        }
        return {
            upsert,
            get: {
                byId: cartById,
                prod: products
            },
            delete: {
                byId: deleteById,
            },
        }
    }

    return { cartPgRepo }
}

module.exports = cartPgRepoFactory
