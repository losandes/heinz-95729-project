/**
 * @typedef {Object} IUser
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {number} timeCreatedMs
 */

/**
 * @typedef {Object} ZodUser
 * @property {import('zod').ZodDefault<import('zod').ZodString>} id
 * @property {import('zod').ZodString} email
 * @property {import('zod').ZodString} name
 * @property {import('zod').ZodDefault<import('zod').ZodNumber>} timeCreatedMs
 */

/**
 * @typedef {import('zod').ZodObject<ZodUser>} ZUser
 */

/**
 * @typedef {import('zod').SafeParseReturnType<ZUser, IUser>} ZSafeParseUser
 */

/**
 * @typedef {import('zod').SafeParseSuccess<ZUser>} ZSafeParseUserSuccess
 */

/**
 * @typedef {import('zod').SafeParseError<ZUser>} ZSafeParseUserError
 */
