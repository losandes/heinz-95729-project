/**
 * @typedef {Object} IResolveUsers
 * @property {string} name
 * @property {(query: { id?: string, email?: string }) => Promise<IUser[]>} find
 * @property {{
 *   id: (id: string) => Promise<IUser | undefined>
 *   email: (email: string) => Promise<IUser | undefined>
 * }} getBy
 * @property {() => Promise<IUser[]>} list
 */
