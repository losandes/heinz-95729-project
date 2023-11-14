import type { ParameterizedContext } from 'koa'
import type { reqCtxSchema } from '../../../../server'
import userSchema from '../typedefs/user'
import KEYS from '../KEYS.js'

export const getById = (
  ctx: ParameterizedContext<reqCtxSchema>
) => async (id: string) => {
  const record = await ctx.state.storage.users.get(KEYS.make.userKey(id))

  return record ? userSchema.parse(record) : undefined
}

export default getById
