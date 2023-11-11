import IndexUsers from './src/loaders/IndexUsers.js'
import resolveUsers from './src/resolvers/resolve-users.js'
import User from './src/typedefs/user.js'

const { indexUsers } = IndexUsers({})

/** @type {IUserLoaders} */
const loaders = {
  indexUsers,
}

/** @type {IUserResolvers} */
const resolvers = {
  resolveUsers,
}

/** @type {IUserTypedefs} */
const typedefs = {
  User,
}

/** @type {IUserModule} */
export { loaders, resolvers, typedefs }
