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

    const updateQuantity = (body, callback) => {
      repo.put({
        path: `/carts/update-quantity`,
        body
      }, callback)
    }

    const deleteItem = (body, callback) => {
      repo.post({
        path: `/carts/delete-item`,
        body
      }, callback)
    }

    const deleteCart = (user_id, callback) => {
      repo.remove({ path: `/carts/delete/${user_id}` }, callback)
    }

    return { getCart, updateQuantity, deleteItem, deleteCart }
  }
}