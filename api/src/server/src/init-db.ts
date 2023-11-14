import type { LogEmitter } from '@polyn/logger'
import type Keyv from 'keyv'
import { seeds as userSeeds } from '../../domains/users'
import type { appCtxSchema } from '..'

type Record = {
  key: string,
  value: any,
}
type Seed = {
  id: number,
  records: Record[]
}

const maybeSeed = (
  seedRepo: Keyv, prefix: string, repo: Keyv, logger: LogEmitter
) => {
  const _maybeSeed = async (seed: Seed) => {
    const _seed = await seedRepo.get(`${prefix}${seed.id}`)

    if (_seed) {
      logger.emit('seed_exists', 'info', `seed ${seed.id} already exists`)
      return
    }

    logger.emit('seeding', 'info', `seed ${seed.id} already exists`)

    await Promise.all(
      seed.records.map((record: any) => repo.set(record.key, record.value))
    )

    await seedRepo.set(`${prefix}${seed.id}`, seed)
  }

  const _maybeSeedAll = async (seeds: typeof userSeeds) => {
    await Promise.all(seeds.map(_maybeSeed))
  }

  return _maybeSeedAll
}

export const initDb = async (appCtx: appCtxSchema) => {
  const { logger, storage: { seeds, users, products }  } = appCtx
  await maybeSeed(seeds, 'U', users, logger)(userSeeds)
}

export default initDb
