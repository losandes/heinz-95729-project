import type { ParameterizedContext } from 'koa'
import type { reqCtxSchema } from '../../../../server'
import userSchema from '../typedefs/user'
import KEYS from '../KEYS.js'

export const getByEmail = (
  ctx: ParameterizedContext<reqCtxSchema>
) => async (email: string) => {
  const id = await ctx.state.storage.users.get(KEYS.make.userByEmailKey(email))
  ctx.state.logger.emit('user_get_by_email', 'trace', { email, id })

  if (!id) {
    return undefined
  }

  const record = await ctx.state.storage.users.get(KEYS.make.userKey(id))
  ctx.state.logger.emit('user_get_by_email', 'trace', { email, id, record })

  return record ? userSchema.parse(record) : undefined
}

export default getByEmail
