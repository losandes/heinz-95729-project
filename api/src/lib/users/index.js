const blueprint = require('@polyn/blueprint')
const immutable = require('@polyn/immutable')
const jwt = require('jsonwebtoken')
const path = require('path')
const uuid = require('uuid').v4
const { User } = require('./src/User.js')({ blueprint, immutable, uuid })
const { UserPgRepo } = require('./src/UserPgRepo.js')({ User })
const { Login } = require('./src/login.js')({ jwt })
const { Register } = require('./src/register.js')()
const { VerifySession } = require('./src/verify-session.js')({ blueprint, jwt })
const { GetProfile } = require('./src/get-profile.js')()
const MigrateUsersFactory = require('./migrate.js')

/**
 * @param {knex} knex - A configured/initialized instance of knex
 */
function UsersFactory (input) {
  const userRepo = new UserPgRepo({ knex: input.knex })
  const { authorize, login } = new Login({ userRepo, env: input.env })
  const { register } = new Register({ userRepo, login })
  const { verifySession } = new VerifySession({ env: input.env })
  const { getProfile } = new GetProfile()
  const migrate = MigrateUsersFactory({ path, knex: input.knex })

  return {
    User,
    userRepo,
    authorize,
    login,
    register,
    verifySession,
    getProfile,
    migrate,
  }
}

module.exports = UsersFactory
