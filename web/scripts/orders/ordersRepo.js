module.exports = {
  scope: 'heinz',
    name: 'ordersRepo',
  dependencies: ['Repo'],
  factory: (Repo) => {
    'use strict'

    const repo = new Repo()

    const get = (callback) => {
        repo.get({ path: `/orders/` }, callback)
    }

    return { get }
  },
}
