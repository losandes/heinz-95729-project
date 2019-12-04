module.exports = {
  scope: 'heinz',
  name: 'cartRepo',
  dependencies: ['Repo'],
  factory: (Repo) => {
    'use strict'

    const repo = new Repo()

    const getCart = (user_id, callback) => {
      repo.get({ path: `/carts/${user_id}` }, callback)
    }

    return { getCart }
  }
}