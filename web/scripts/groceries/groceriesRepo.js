module.exports = {
  scope: 'heinz',
  name: 'groceriesRepo',
  dependencies: ['Repo'],
  factory: (Repo) => {
    'use strict'

    const repo = new Repo()

    const get = (uid, callback) => {
      repo.get({ path: `/groceries/${uid}` }, callback)
    }

    return { get }
  }
}
