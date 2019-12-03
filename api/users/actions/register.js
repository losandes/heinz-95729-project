module.exports.name = 'register'
module.exports.dependencies = ['usersRepo']
module.exports.factory = function (repo) {
  'use strict'

  const validateBody = (body) => (resolve, reject) => {
    // TODO: make sure the properties we need are here
    resolve(body)
  }

  const register = (body) => (resolve, reject) => {
    //encry2
    //
    console.log(body.password)

    var ncrypt = require('ncrypt')
    var encrypted_data = ncrypt.encr(body.password)
    //console.log(encrypted_data)

    body.password = encrypted_data
    console.log(body)

    return repo.create(body)
      .then(resolve)
      .catch(reject)
  }

  return { register, validateBody }
}
