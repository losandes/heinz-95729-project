module.exports.name = 'usersController'
module.exports.dependencies = ['router', 'register', 'login', 'logger']
module.exports.factory = (router, _register, _login, logger) => {
  'use strict'

  const { register, validateBody } = _register
  const { getUser, makeAuthToken } = _login

  router.post('/users', function (req, res) {
    const body = req.body

    Promise.resolve(body)
      .then(body => new Promise(getUser(body.email, body.password)))
      .then(user => {
        if (user) {
          throw new Error('A user with that email address already exists')
        }

        return body
      })
      .then(body => new Promise(validateBody(body)))
      .then(body => new Promise(register(body)))
      .then(() => new Promise(getUser(body.email, body.password)))
      .then(user => new Promise(makeAuthToken(user)))
      .then(response => {
        res.status(201).send(response)
      }).catch(err => {
        logger.error(err)
        res.status(400).send({ messages: [err.message] })
      })
  })

  router.post('/users/login', function (req, res) {
    Promise.resolve(req.body)
      .then((body) => new Promise(getUser(body.email, body.password)))
      .then(user => new Promise(makeAuthToken(user)))
      .then(response => {
        res.status(200).send(response)
      }).catch(err => {
        logger.error(err)
        res.status(400).send({ messages: [err.message] })
      })
  })

  return router
}
