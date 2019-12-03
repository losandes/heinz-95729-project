module.exports.name = 'register'
module.exports.dependencies = ['usersRepo']
module.exports.factory = function (repo) {
  'use strict'

  const validateBody = (body) => (resolve, reject) => {
    // TODO: make sure the properties we need are here
    resolve(body)
  }

  const register = (body) => (resolve, reject) => {

    var ncrypt = require('ncrypt')
    var userObj = Object.assign({}, body)
    userObj.password = ncrypt.encr(body.password)
    
    return repo.create(userObj)
      .then(resolve)
      .catch(reject)
  }

  return { register, validateBody }
}
