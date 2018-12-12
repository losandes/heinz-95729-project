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
	
	const my_history = (body, callback) =>{
	repo.get({path:'/history'}, callback)
	}

    return { login, register, my_history}
  }
}
