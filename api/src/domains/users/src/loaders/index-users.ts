import { groupBy } from 'ramda'
import type { appCtxSchema } from '../../../../server'
import userSchema from '../typedefs/user'
import _KEYS from '../KEYS'
import _seeds, { type userSeed } from './seeds/seeds'


export default function ({
  user = userSchema,
  seeds = _seeds,
  KEYS = _KEYS,
}) {
  /**
   * Loads the users from the data store. Because this prototype
   * uses Keyv file storage by default, we need to load the data
   * into memory to be able to resolve records
   */
  async function indexOneSeed (
    usersSeed: userSeed,
    { logger, storage }: appCtxSchema,
  ) {
    const seed = await storage.users.get(`users::seed::${usersSeed.id}`)

    if (seed) {
      return { fulfilled: [], rejected: [] }
    }

    // @ts-ignore
    const users = usersSeed.data.map(user.parse)
    const userIds = users.reduce((mutableIds: string[], user: userSchema) => {
      mutableIds.push(user.id)
      return mutableIds
    }, [])
    const sets = users.reduce((mutableSets: Promise<any>[], user: userSchema) => {
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

    const { fulfilled, rejected } = groupBy(
      (val) => val.status,
      await Promise.allSettled(sets)
    ) as {
      fulfilled: PromiseFulfilledResult<any>[],
      rejected: PromiseRejectedResult[],
    }

    rejected?.forEach((rejection) => {
      logger.emit('users_seed_failure', 'warn', rejection.reason)
    })

    await storage.users.set(`users::seed::${usersSeed.id}`, usersSeed.id)

    return { fulfilled, rejected }
  } // /indexUsers

  /**
   * Loads the users from the data store. Because this prototype
   * uses Keyv file storage by default, we need to load the data
   * into memory to be able to resolve records
   */
  async function indexUsers (context: appCtxSchema) {
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
