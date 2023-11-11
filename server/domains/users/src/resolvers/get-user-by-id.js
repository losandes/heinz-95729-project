import user from '../typedefs/user.js'
import KEYS from '../KEYS.js'

/**
 * @param {IKoaContext} context
 * @returns {IResolveUsers['getBy']['id']}
 */
export const getById = ({ state: { storage } }) => async (id) => {
  const record = await storage.users.get(KEYS.make.userKey(id))

  return record ? user.parse(record) : undefined
}

export default getById
