/**
 * @param {cartPgRepo} cartRepo
 */
function DeleteAllcartFactory(deps) {
    'use strict'

    const { cartRepo } = deps

    const deleteAllCart = async (ctx) => {

        const logger = ctx.request.state.logger
        console.log(ctx.state.session.id)
        try {

            const cart = await cartRepo.delete.deleteAll(ctx.state.session.id)

            if (cart) {

                ctx.response.status = 200
                // ctx.response.body = cart
            } else {
                ctx.response.status = 404
            }
        } catch (err) {
            logger.emit('product_read_error', 'error', { err })
            throw new Error('Failed to read product with uid ' + ctx.params.productid)
        }
    }

    return { deleteAllCart }
}

module.exports = DeleteAllcartFactory
