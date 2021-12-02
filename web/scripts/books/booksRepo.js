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

    const addReview = (description, rating, book_id, callback) => {
      repo.post({
        path: '/reviews',
        body: { description, rating, book_id },
      }, callback)
    }

    return { get, getReviews, addReview }
  },
}
