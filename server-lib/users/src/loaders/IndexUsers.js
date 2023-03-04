import _User from '../typedefs/User.js'
import _seeds from './seeds/seeds.js'
import _KEYS from '../KEYS.js'

/**
 * @param {{
 *   User?: User
 *   seeds?: IUsersSeed[]
 *   KEYS?: IUserKeys
 * }} dependencies
 * @returns {{ indexUsers: (context: IAppContext) => Promise<ISeedResult> }}
 */
export default function ({
  User = _User,
  seeds = _seeds,
  KEYS = _KEYS,
}) {
  /**
   * Casts a data record to a User model
   * @param {IUserModel} user
   * @returns {IUser}
   */
  const toUser = (user) => new User(user)

  /**
   * Loads the users from the data store. Because this prototype
   * uses Keyv file storage by default, we need to load the data
   * into memory to be able to resolve records
   * @param {IUsersSeed} usersSeed
   * @param {IAppContext} context
   * @returns {Promise<ISeedResult>}
   */
  async function indexOneSeed (usersSeed, { logger, storage }) {
    const seed = await storage.users.get(`users::seed::${usersSeed.id}`)

    if (seed) {
      return { seeded: false, fulfilled: 0, rejected: 0 }
    }

    /** @type {IUser[]} */
    const users = usersSeed.data.map(toUser)
    const userIds = users.reduce((/** @type {string[]} */ ids, user) => {
      ids.push(user.id)
      return ids
    }, [])
    const sets = users.reduce((/** @type {Promise<any>[]} */ _sets, user) => {
      _sets.push(storage.users.set(
        KEYS.make.userKey(user.id),
        user,
      ))
      _sets.push(storage.users.set(
        KEYS.make.userByEmailKey(user.email),
        user.id,
      ))
      return _sets
    }, [])

    sets.push(storage.users.set(KEYS.USER_IDS, userIds))
    sets.push(storage.users.set(`users::seed::${usersSeed.id}`, usersSeed.id))

    const results = await Promise.allSettled(sets)
    let fulfilled = 0
    let rejected = 0

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        fulfilled += 1
      } else if (result.status === 'rejected') {
        rejected += 1
        logger.emit('users_seed_failure', 'warn', result.reason)
      }
    })

    return { seeded: true, fulfilled, rejected }
  } // /indexUsers

  /**
   * Loads the users from the data store. Because this prototype
   * uses Keyv file storage by default, we need to load the data
   * into memory to be able to resolve records
   * @param {IAppContext} context
   * @returns {Promise<ISeedResult>}
   */
  async function indexUsers (context) {
    const { storage } = context
    const results = { seeded: false, fulfilled: 0, rejected: 0 }

    for (const seed of seeds) {
      const result = await indexOneSeed(seed, context)
      results.seeded = results.seeded || result.seeded
      results.fulfilled += result.fulfilled
      results.rejected += result.rejected
    }

    await storage.users.set(KEYS.LAST_INDEXED, Date.now())

    return results
  } // /indexUsers

  return { indexUsers }
}
