/**
 * Makes a key for key-value-storage, using the user's id
 * @param {string} id
 * @returns {string}
 */
export const makeUserKey = (id) => `users::${id}`

/**
 * Makes a key for key-value-storage, using the email
 * @param {string} email
 * @returns {string}
 */
export const makeUserByEmailKey = (email) => `users::email::${email}`

export const KEYS = {
  USER_IDS: 'users::ids',
  LAST_INDEXED: 'users::last_indexed',
}

export default {
  USER_IDS: KEYS.USER_IDS,
  LAST_INDEXED: KEYS.LAST_INDEXED,
  RESOLVER: 'users',
  make: {
    userKey: makeUserKey,
    userByEmailKey: makeUserByEmailKey,
  },
}
