import IndexUsers from './src/loaders/IndexUsers.js'
import ResolveUsers from './src/resolvers/ResolveUsers.js'
import User from './src/typedefs/user.js'

const { indexUsers } = IndexUsers({})
const { resolveUsers } = ResolveUsers({})

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
