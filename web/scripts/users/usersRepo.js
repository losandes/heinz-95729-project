module.exports = {
  scope: 'heinz',
  name: 'usersRepo',
  dependencies: ['Repo'],
  factory: (Repo) => {
    'use strict'

    const repo = new Repo()

    const login = (body, callback) => {
      repo.post({
        path: '/users/login',
        body
      }, callback)
    }

    const register = (body, callback) => {
      repo.post({
        path: '/users',
        body
      }, callback)
    }

    const history = (uid, callback) => {
      repo.get({ path: `/orders/${uid}` }, callback)
    }

    return { login, register, history }
  }
}
