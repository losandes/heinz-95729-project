/**
 * @typedef {Object} ISessionUser
 * @property {string} id
 * @property {string} email
 * @property {string} name
 */
/**
 * The session information for the signed in user
 * This should be signed in a JWT or equivalent and
 * tracked via a cookie
 * - id: the user's id
 * - email: the user's email address
 * - name: the user's name
 * - nonce: a CPRNG per session used to avoid replay attacks
 * @typedef {Object} ISession
 * @property {string} id
 * @property {ISessionUser} user
 */

/**
 * @typedef {ISession & import("@polyn/immutable").IValidatedImmutable<ISession>} IValidatedImmutableSession
 */

/**
 * @typedef {new (input: ISession | import("jsonwebtoken").JwtPayload) => IValidatedImmutableSession} ImmutableSession
 */

/**
 * @typedef {Object} SessionStaticProps
 * @property {any} schema
 */

/**
 * @typedef {ImmutableSession & SessionStaticProps} Session
 */
