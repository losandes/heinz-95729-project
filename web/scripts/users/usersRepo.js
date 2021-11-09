module.exports = {
  scope: 'heinz',
  name: 'usersRepo',
  dependencies: ['Repo'],
  factory: (Repo) => {
    'use strict'

    const repo = new Repo()

    const login = (email, callback) => {
      repo.post({
        path: '/users/login',
        body: { email },
      }, callback)
    }

    const register = (body, callback) => {
      repo.post({
        path: '/users',
        body,
      }, callback)
    }

    return { login, register }
  },
}
