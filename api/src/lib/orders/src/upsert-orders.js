/**
 * @param {ordersPgRepo} ordersRepo
 */
function UpsertordersFactory(deps) {
    'use strict'

    const { orders,ordersRepo } = deps

    const upsertOrders = async (ctx) => {
        let orders1
        const logger = ctx.request.state.logger

        try {
            var input = { userid: ctx.state.session.id, productids: ctx.params.pid, totalprice: ctx.params.price,purchasedate:'test' }
            orders1=new orders(input)
            const response = await ordersRepo.upsert(orders1)

            if (response) {

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
