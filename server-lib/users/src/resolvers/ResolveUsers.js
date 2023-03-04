import _User from '../typedefs/User.js'
import _KEYS from '../KEYS.js'

/**
 * @param {{
 *   User?: User
 *   KEYS?: IUserKeys
 * }} dependencies
 * @returns {{ resolveUsers: (context: IKoaContext) => IResolveUsers }}
 */
export default function ({
  User = _User,
  KEYS = _KEYS,
}) {
  /**
   * @param {IKoaContext} context
   * @returns {() => Promise<IUser[]>}
   */
  const _list = ({ state: { logger, storage } }) => {
    /**
     * @returns {Promise<IUser[]>}
     */
    return async () => {
      const ids = await storage.users.get(KEYS.USER_IDS)

      if (!ids) {
        return []
      }

      const results = await Promise.allSettled(
        ids.map((/** @type {string} */ id) =>
          storage.users.get(KEYS.make.userKey(id))))

      return results.reduce((/** @type {IUser[]} */ users, result) => {
        if (result.status === 'fulfilled') {
          try {
            users.push(new User(result.value))
          } catch (e) {
            logger.emit('user_get_produced_invalid_user', 'warn', e)
          }
        } else {
          logger.emit('user_get_failed', 'warn', result.reason)
        }

        return users
      }, [])
    }
  }

  /**
   *
   * @param {IKoaContext} context
   * @returns {{
   *   id: (id: string) => Promise<IUser | undefined>
   *   email: (email: string) => Promise<IUser | undefined>
   * }}
   */
  const _getBy = ({ state: { storage } }) => {
    /**
     * @param {string} id
     * @returns {Promise<IUser | undefined>}
     */
    const id = async (id) => {
      const user = await storage.users.get(KEYS.make.userKey(id))

      return user ? new User(user) : undefined
    }

    /**
     * @param {string} email
     * @returns {Promise<IUser | undefined>}
     */
    const email = async (email) => {
      const id = await storage.users.get(KEYS.make.userByEmailKey(email))

      if (!id) {
        return undefined
      }

      const user = await storage.users.get(KEYS.make.userKey(id))

      return user ? new User(user) : undefined
    }

    return { id, email }
  }

  /**
   *
   * @param {IKoaContext} context
   * @returns {(query: { id?: string, email?: string }) => Promise<IUser[]>}
   */
  const _find = (context) => {
    const getBy = _getBy(context)

    /**
     * @param {{ id?: string, email?: string }} query
     * @returns {Promise<IUser[]>}
     */
    return async (query) => {
      let user

      if (typeof query?.id === 'string') {
        user = await getBy.id(query.id)
      } else if (typeof query?.email === 'string') {
        user = await getBy.email(query.email)
      }

      return user ? [user] : []
    }
  }

  // TODO: List, byEmail, and maybeLoadUsers (e.g. put the check for user data here)

  /**
   * Resolvers for users
   * @param {IKoaContext} context
   * @returns {IResolveUsers}
   */
  const resolveUsers = (context) => {
    return {
      name: KEYS.RESOLVER,
      find: _find(context),
      getBy: _getBy(context),
      list: _list(context),
    }
  }

  return { resolveUsers }
}
