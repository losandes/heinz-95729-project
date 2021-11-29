/**
 * @param {ordersPgRepo} ordersRepo
 */
function GetordersFactory(deps) {
    'use strict'

    const { ordersRepo } = deps

    const getOrders = async (ctx) => {
        const logger = ctx.request.state.logger
  

        try {

            const orders = await ordersRepo.get.byId(ctx.state.session.id)

            if (orders) {

                ctx.response.status = 200
                ctx.response.body = orders
            } else {
                ctx.response.status = 404
            }
        } catch (err) {
            logger.emit('product_read_error', 'error', { err })
            throw new Error('Failed to read product with uid ' + ctx.params.id)
        }
    }

    return { getOrders }
}

module.exports = GetordersFactory
