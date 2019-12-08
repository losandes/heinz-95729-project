module.exports = {
  scope: 'heinz',
  name: 'downloadRepo',
  dependencies: ['Repo'],
  factory: (Repo) => {
    'use strict'

    const repo = new Repo()

    const download = ({ uid, order_id }, callback) => {
      repo.get({ path: `/books/download/${uid}/${order_id}` }, callback)
    }

    return { download }
  }
}



