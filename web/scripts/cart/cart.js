module.exports = {
    scope: 'heinz',
    name: 'cart',
    dependencies: ['router'],
    factory: (router) => {
        'use strict'


        return function cart(cart) {
            cart = Object.assign({}, cart)
            const self = {
                id: product.id,
                uid: product.uid,
                title: product.title,
                description: product.description,
                metadata: product.metadata,
                price: product.price,
                images: [],
                thumbnailHref: product.thumbnailHref || '/images/products/default.png',
                thumbnailAlt: `thumbnail for ${product.title}`,
                showThumbnail: product.thumbnailHref != null,
                detailsLink: `/${product.type}/${product.uid}`,
            }
            return self
        }
    },
}
