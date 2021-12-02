/**
 * @param {ordersPgRepo} ordersRepo
 */
function GetordersFactory(deps) {
    'use strict'

    const { ordersRepo } = deps

    const getOrders = async (ctx) => {
        const logger = ctx.request.state.logger

        var orderDetails=[];
  

        try {

            const orders = await ordersRepo.get.byId(ctx.state.session.id)
            for (var i = 0; i < orders.length;i++) {
                var prods = orders[i].productids.split(',');
                const products = await ordersRepo.get.prod(prods)
                orderDetails.push({ id: orders[i].id, price: orders[i].totalprice, products: products, date: orders[i].purchasedate})

            }
            if (orderDetails) {
                ctx.response.status = 200
                ctx.response.body = orderDetails
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
