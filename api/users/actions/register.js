module.exports.name = 'register'
module.exports.dependencies = ['usersRepo']
module.exports.factory = function (repo) {
  'use strict'

  const validateBody = (body) => (resolve, reject) => {
    // TODO: make sure the properties we need are here
    resolve(body)
  }

  const register = (body) => (resolve, reject) => {
    return repo.create(body)
      .then(resolve)
      .catch(reject)
  }

  return { register, validateBody }
}
