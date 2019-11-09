module.exports.name = 'login'
module.exports.dependencies = ['usersRepo', 'User', 'jsonwebtoken', 'environment']
module.exports.factory = function (repo, User, jwt, env) {
  'use strict'

  const SECRET = env.get('jwt:secret')
  const EXPIRATION = env.get('jwt:expiresIn')

  const getUser = (email) => (resolve, reject) => {
    return repo.get(email)
      .then((doc) => new User(doc))
      .then(resolve)
      .catch(reject)
  }

  const makeAuthToken = (user) => (resolve, reject) => {
    resolve({
      user,
      authToken: jwt.sign({
        _id: user._id,
        name: user.name,
        email: user.email
      },
      SECRET,
      { expiresIn: EXPIRATION })
    })
  }

  return { getUser, makeAuthToken }
}
