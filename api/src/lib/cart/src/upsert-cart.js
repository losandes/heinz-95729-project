/**
 * @param {cartPgRepo} cartRepo
 */
function UpsertcartFactory(deps) {
    'use strict'

    const { cart,cartRepo } = deps

    const upsertCart = async (ctx) => {
        let cart1
        const logger = ctx.request.state.logger

        try {
            var input = { userid: ctx.state.session.id, productid: ctx.params.pid }
            cart1 = new cart(input)
            const records = await cartRepo.upsert(cart1)

            if (records) {

                ctx.response.status = 200
                ctx.response.body = 'done'
            } else {
                ctx.response.status = 404
            }
        } catch (err) {
            logger.emit('product_read_error', 'error', { err })
            throw new Error('Failed to read product with uid ' + ctx.params.id)
        }
    }

    return { upsertCart }
}

module.exports = UpsertcartFactory
