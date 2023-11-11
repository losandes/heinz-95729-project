import { withArray } from '@heinz-95729/functional'
import user from '../typedefs/user.js'
import KEYS from '../KEYS.js'

/**
 * @param {IKoaContext} context
 * @returns {IResolveUsers['list']}
 */
export const list = ({ state: { logger, storage } }) => {
  /**
   * @param {string[]} ids
   * @returns {Promise<IUser[]>}
   */
  const loadUsers = async (ids) => {
    const results = Promise.allSettled(
      ids.map((id) =>
        storage.users.get(KEYS.make.userKey(id))),
    )

    /** @type {IGroupedPromiseSettledResults} */
    const { fulfilled, rejected } = withArray(results)
      .groupBy((/** @type {PromiseSettledResult<any>} */ { status }) => status)

    rejected.forEach((rejection) => {
      logger.emit('user_get_failed', 'warn', rejection.reason)
    })

    return fulfilled.map(({ value }) => value)
  }

  /**
   * @param {any[]} users
   * @returns {IUser[]}
   */
  const mapToUsers = (users) => {
    // @ts-ignore
    const parsed = withArray(users.map(user.safeParse))
      .groupBy((/** @type {ZSafeParseUser} */ { success }) =>
        success ? 'fulfilled' : 'rejected',
      )

    parsed.rejected.forEach(
      (/** @type {ZSafeParseUserError} */ { error }) => {
        logger.emit('user_get_produced_invalid_user', 'warn', error)
      },
    )

    return parsed.fulfilled.map(
      (/** @type {ZSafeParseUserSuccess} */ { data }) => data,
    )
  }

  /**
   * @param {string[]} [_ids]
   * @returns {Promise<IUser[]>}
   */
  return async (_ids) => {
    const records = await loadUsers(_ids ||
      await storage.users.get(KEYS.USER_IDS))

    return mapToUsers(records)
  }
}

export default list
