/**
 * @typedef {Object} IGetUsersBy
 * @property {(id: string) => Promise<IUser | undefined>} id
 * @property {(email: string) => Promise<IUser | undefined>} email
 */

/**
 * @typedef {Object} IResolveUsers
 * @property {string} name
 * @property {(query: { id?: string, email?: string }) => Promise<IUser[]>} find
 * @property {IGetUsersBy} getBy
 * @property {() => Promise<IUser[]>} list
 */
