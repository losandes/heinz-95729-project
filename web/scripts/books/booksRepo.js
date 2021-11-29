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

    const getReviews = (uid, callback) => {
      repo.get({ path: `/reviews/${uid}` }, callback)
    }

    const addReview = (addDescription, addRating, uid, callback) => {
      repo.post({
        path: `/reviews/${uid}`,
        body: { addDescription, addRating },
      }, callback)
    }

    return { get, getReviews, addReview }
  },
}
