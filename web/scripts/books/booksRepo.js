module.exports = {
  scope: 'heinz',
  name: 'booksRepo',
  dependencies: ['Repo'],
  factory: (Repo) => {
    'use strict'

    const repo = new Repo()

    const get = (uid, callback) => {
      repo.get({ path: `/books/${uid}` }, callback)
    }

    return { get }
  },
}
