module.exports = {
  scope: 'heinz',
  name: 'ordersRepo',
  dependencies: ['Repo'],
  factory: (Repo) => {
    'use strict'

    const repo = new Repo()

    const history = (uid, callback) => {
      repo.get({ path: `/orders/${uid}` }, callback)
    }

    return { history }
  }
}
