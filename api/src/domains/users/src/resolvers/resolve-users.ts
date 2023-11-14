import type { Context } from 'koa'
import KEYS from '../KEYS.js'
import find from './find-user.js'
import getByEmail from './get-user-by-email.js'
import getById from './get-user-by-id.js'
import list from './list-users.js'

/**
 * Resolvers for users
 */
export const resolveUsers = (context: Context) => {
  const getBy = {
    id: getById(context),
    email: getByEmail(context),
  }

  return {
    name: KEYS.RESOLVER,
    find: find({ getBy }),
    getBy,
    list: list(context),
  }
}

export default resolveUsers
