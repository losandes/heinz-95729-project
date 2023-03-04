/**
 * The session information for the signed in user
 * This should be signed in a JWT or equivalent and
 * tracked via a cookie
 * @typedef {Object} ISession
 * @property {string} id
 * @property {string} email
 * @property {string} name
 */

/**
 * @typedef {ISession & import("@polyn/immutable").IValidatedImmutable<ISession>} IValidatedImmutableSession
 */

/**
 * @typedef {new (input: ISession | import("jsonwebtoken").JwtPayload) => IValidatedImmutableSession} ImmutableSession
 */

/**
 * @typedef {Object} SessionStaticProps
 * @property {Object} blueprint
 */

/**
 * @typedef {ImmutableSession & SessionStaticProps} Session
 */
