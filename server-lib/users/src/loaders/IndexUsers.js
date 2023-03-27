import { withArray } from '@heinz-95729/functional'
import _user from '../typedefs/user.js'
import _seeds from './seeds/seeds.js'
import _KEYS from '../KEYS.js'

/**
 * @param {{
 *   user?: ZUser
 *   seeds?: IUsersSeed[]
 *   KEYS?: IUserKeys
 * }} dependencies
 * @returns {{ indexUsers: (context: IAppContext) => Promise<ISeedResult> }}
 */
export default function ({
  user = _user,
  seeds = _seeds,
  KEYS = _KEYS,
}) {
  /**
   * Loads the users from the data store. Because this prototype
   * uses Keyv file storage by default, we need to load the data
   * into memory to be able to resolve records
   * @param {IUsersSeed} usersSeed
   * @param {IAppContext} context
   * @returns {Promise<IGroupedPromiseSettledResults>}
   */
  async function indexOneSeed (usersSeed, { logger, storage }) {
    const seed = await storage.users.get(`users::seed::${usersSeed.id}`)

    if (seed) {
      return { fulfilled: [], rejected: [] }
    }

    // @ts-ignore
    const users = usersSeed.data.map(user.parse)
    const userIds = users.reduce((/** @type {string[]} */ mutableIds, user) => {
      mutableIds.push(user.id)
      return mutableIds
    }, [])
    const sets = users.reduce((/** @type {Promise<any>[]} */ mutableSets, user) => {
      mutableSets.push(storage.users.set(
        KEYS.make.userKey(user.id),
        user,
      ))
      mutableSets.push(storage.users.set(
        KEYS.make.userByEmailKey(user.email),
        user.id,
      ))
      return mutableSets
    }, [storage.users.set(KEYS.USER_IDS, userIds)])

    /** @type {IGroupedPromiseSettledResults} */
    const { fulfilled, rejected } = withArray(await Promise.allSettled(sets))
      .groupBy((/** @type {PromiseSettledResult<any>} */ { status }) => status)

    rejected.forEach((rejection) => {
      logger.emit('users_seed_failure', 'warn', rejection.reason)
    })

    await storage.users.set(`users::seed::${usersSeed.id}`, usersSeed.id)

    return { fulfilled, rejected }
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

    const results = await seeds.reduce(async (asyncMutableResults, seed) => {
      const mutableResults = await asyncMutableResults
      const oneResult = await indexOneSeed(seed, context)
      mutableResults.seeded = mutableResults.seeded || oneResult.fulfilled.length > 0
      mutableResults.fulfilled += oneResult.fulfilled.length
      mutableResults.rejected += oneResult.rejected.length

      return mutableResults
    }, Promise.resolve({ seeded: false, fulfilled: 0, rejected: 0 }))

    await storage.users.set(KEYS.LAST_INDEXED, Date.now())

    return results
  } // /indexUsers

  return { indexUsers }
}
