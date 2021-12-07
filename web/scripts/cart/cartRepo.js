module.exports = {
    scope: 'heinz',
    name: 'cartRepo',
    dependencies: ['Repo'],
    factory: (Repo) => {
        'use strict'

        const repo = new Repo()

        const get = (callback) => {
            repo.get({ path: `/cart` }, callback)
        }
        const buyNow = (pid,price,callback) => {
            repo.get({ path: `/orders-upsert/${pid}/${price}` }, callback)
        }
        const removeFromCart = (productid, callback) => {
            console.log(productid)
            repo.remove({
                path: '/cart-delete/' + productid,
        }, callback)
        }
        const removeAll = (callback) => {
            repo.get({ path: `/cart-deleteAll/` }, callback)
        }
        return { get, buyNow, removeFromCart, removeAll }
    },
}
