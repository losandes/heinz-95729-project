/**
 * @param {ordersPgRepo} ordersRepo
 */
function UpsertordersFactory(deps) {
    'use strict'

    const { ordersRepo } = deps

    const upsertOrders = async (ctx) => {

        const logger = ctx.request.state.logger

        try {
            var input = { userid: ctx.state.session.id, productids: ctx.params.pid, totalprice:ctx.params.price}
            const orders = await ordersRepo.upsert(input)

            if (orders) {

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

    return { upsertOrders }
}

module.exports = UpsertordersFactory
