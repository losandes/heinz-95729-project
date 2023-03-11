/**
 * The session information for the signed in user
 * This should be signed in a JWT or equivalent and
 * tracked via a cookie
 * @typedef {Object} IUserModel
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {number} timeCreatedMs
 */

/**
 * @typedef {IUserModel & import("@polyn/immutable").IValidatedImmutable<IUserModel>} IUser
 */

/**
 * @typedef {new (input: IUserModel) => IUser} ImmutableUser
 */

/**
 * @typedef {Object} IUserStaticProps
 * @property {any} session
 */

/**
 * @typedef {ImmutableUser & IUserStaticProps} User
 */
