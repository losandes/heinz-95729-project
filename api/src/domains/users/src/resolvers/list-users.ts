import type { ParameterizedContext } from 'koa'
import { groupBy } from 'ramda'
import type { SafeParseError, SafeParseSuccess } from 'zod'
import type { reqCtxSchema } from '../../../../server'
import { userSchema } from '../typedefs/user.js'
import KEYS from '../KEYS.js'

export const list = (ctx: ParameterizedContext<reqCtxSchema>) => {
  const loadUsers = async (ids: string[]) => {
    const results = await Promise.allSettled(
      ids.map((id) =>
        ctx.state.storage.users.get(KEYS.make.userKey(id))),
    )

    const { fulfilled, rejected } = groupBy((val) => val.status, results) as {
      fulfilled: PromiseFulfilledResult<any>[],
      rejected: PromiseRejectedResult[],
    }

    rejected.forEach((rejection) => {
      ctx.state.logger.emit('user_get_failed', 'warn', rejection.reason)
    })

    return fulfilled.map(({ value }) => value)
  }

  const mapToUsers = (users: unknown[]) => {
    const { fulfilled, rejected } = groupBy(
      (val) => val.success ? 'fulfilled' : 'rejected',
      users.map((user) => userSchema.safeParse(user)),
    ) as {
      fulfilled: SafeParseSuccess<userSchema>[]
      rejected: SafeParseError<userSchema>[]
    }

    rejected?.forEach(({ error }) => {
        ctx.state.logger.emit('user_get_produced_invalid_user', 'warn', error)
      },
    )

    return fulfilled?.map(({ data }) => data)
  }

  return async (_ids: string[]) => {
    const records = await loadUsers(_ids ||
      await ctx.state.storage.users.get(KEYS.USER_IDS))

    return mapToUsers(records)
  }
}

export default list
