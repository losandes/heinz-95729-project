/**
 * Makes a key for key-value-storage, using the user's id
 */
export const makeUserKey = (id: string) => `users::${id}`

/**
 * Makes a key for key-value-storage, using the email
 */
export const makeUserByEmailKey = (email: string) => `users::email::${email}`

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
