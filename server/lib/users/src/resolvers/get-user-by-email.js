import user from '../typedefs/user.js'
import KEYS from '../KEYS.js'

/**
 *
 * @param {IKoaContext} context
 * @returns {IResolveUsers['getBy']['email']}
 */
export const getByEmail = ({ state: { storage } }) => async (email) => {
  const id = await storage.users.get(KEYS.make.userByEmailKey(email))

  if (!id) {
    return undefined
  }

  const record = await storage.users.get(KEYS.make.userKey(id))

  return record ? user.parse(record) : undefined
}

export default getByEmail
