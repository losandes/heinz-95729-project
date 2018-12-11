module.exports = {
  scope: 'heinz',
  name: 'cartRepo',
  dependencies: ['Repo'],
  factory: (Repo) => {
    'use strict'

    const repo = new Repo()

    const get = (email, callback) => {
      repo.get({ path: `/cart/${email}` }, callback)
    }

    const checkout = (cart, callback) => {
      repo.post({
        path: '/checkout',
        body: { cart }
      }, callback)
    }

    const search = (query, callback) => {
      repo.get({ path: `/products?q=${query}` }, callback)
    }

    return { get, search, checkout }
  }
}
