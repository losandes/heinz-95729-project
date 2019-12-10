module.exports = {
  scope: 'heinz',
  name: 'stripeRepo',
  dependencies: ['Repo'],
  factory: (Repo) => {
    'use strict'

    const repo = new Repo()

    const post = (uid, callback) => {
      repo.post({ path: `/orders/add/${uid}` }, callback)
    }

    return { post }
  }
}
