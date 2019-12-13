module.exports = {
  scope: 'heinz',
  name: 'downloadRepo',
  dependencies: ['Repo'],
  factory: (Repo) => {
    'use strict'

    const repo = new Repo()
    const headers = {
      'Content-Type': 'application/pdf',
      'Accept': 'application/pdf'
    }
    const download = ({ uid, order_id }, callback) => {
      repo.get({ 
        path: `/books/download/${uid}/${order_id}`, 
        responseType: 'arraybuffer', 
        headers: headers}, callback)
    }

    return { download }
  }
}



