/**
 * @typedef {Object} IUserLoaders
 * @property {(context: IAppContext) => Promise<ISeedResult> } indexUsers
 */

/**
 * @typedef {Object} IUserResolvers
 * @property {(context: IKoaContext) => IResolveUsers} resolveUsers
 */

/**
 * @typedef {Object} IUserTypedefs
 * @property {ZUser} User
 */

/**
 * @typedef {Object} IUserModule
 * @property {IUserLoaders} loaders
 * @property {IUserResolvers} resolvers
 * @property {IUserTypedefs} typedefs
 */
