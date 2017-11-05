module.exports.name = 'authHandler'
module.exports.dependencies = ['jsonwebtoken', 'environment']
module.exports.factory = (jwt, env) => {
  const SECRET = env.get('jwt:secret')

  return (req, res, next) => {
    const authHeader = req.headers.authorization
    const notAuthenticated = () => {
      res.locals.isAuthenticated = false
      return next()
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return notAuthenticated()
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        return notAuthenticated()
      }

      res.locals.jwt = {
        token,
        decoded
      }
      res.locals.isAuthenticated = true

      return next()
    })
  }
}
