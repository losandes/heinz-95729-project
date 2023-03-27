/**
 * - id: the user's id
 * - email: the user's email address
 * - name: the user's name
 * @typedef {Object} ISessionUser
 * @property {string} id
 * @property {string} email
 * @property {string} name
 */

/**
 * The session information for the signed in user
 * This should be signed in a JWT or equivalent and
 * tracked via a cookie
 * - id: a CPRNG per session used to mitigate replay attacks
 * - user: the user data
 * @typedef {Object} ISession
 * @property {string} id
 * @property {ISessionUser} user
 */

/**
 * @typedef {Object} ZodSessionUser
 * @property {import('zod').ZodString} id
 * @property {import('zod').ZodString} email
 * @property {import('zod').ZodString} name
 */

/**
 * @typedef {Object} ZodSession
 * @property {import('zod').ZodString} id
 * @property {import('zod').ZodObject<ZodSessionUser>} user
 */

/**
 * @typedef {import('zod').ZodObject<ZodSession>} ZSession
 */
