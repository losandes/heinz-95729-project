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
        body: { email }
      }, callback)
    }

    const register = (body, callback) => {
      repo.post({
        path: '/users',
        body
      }, callback)
    }

    const addCat = (email, categories, callback) => {
      repo.put({
        path: '/users/' + email + '/addcat',
        body: { categories }
      }, callback)
    }

    const remCat = (email, categories, callback) => {
      repo.put({
        path: '/users/' + email + '/remcat',
        body: { categories }
      }, callback)
    }

    return { login, register, addCat, remCat }
  }
}
