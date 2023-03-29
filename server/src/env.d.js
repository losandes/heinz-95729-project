/**
 * - KID: 'The key id of this secret',
 * - SECRET: 'a CPRNG of appropriate length for the algorithm being used to sign tokens (e.g. 256 bits / 32 chars for HS256; 512 bits / 64 chars for HS512)',
 * - EXPIRATION: 'An optional expiration time expressed as the number of milliseconds elapsed since midnight, January 1, 1970 Universal Coordinated Time (UTC) (e.g. `Date.now() + (86400000 * 30)`; `new Date(\'2023-04-01\').getTime()`',
 * @typedef {Object} IKidSecretPair
 * @property {string} KID
 * @property {string} SECRET
 * @property {number} [EXPIRATION]
 */

/**
 * #IENVVARS
 * The environment variables used to configure the app and
 * requests to the app.
 *
 * - NODE_ENV: 'the environment the app is running in: /^(local|test|development|production)$/',
 * - NODE_ENV_ENFORCE_SECURITY: 'whether or not to enforce secure configurations like HTTPS (computed; false when NODE_ENV is local or development)',
 * - SERVER_VERSION: 'the version as stated in the package.json file',
 * - SERVER_PORT: 'the port this app can be reached at: default=3001',
 * - SERVER_PROXY_PREFIX: 'optional path this api can be reached at when it\'s running in proxy mode',
 * - SERVER_IS_IN_PROXY: 'whether or not the app is running in proxy mode (computed; conditionally set to true when the value of SERVER_PROXY_PREFIX is not an empty string)',
 * - SERVER_ORIGIN: 'the HTTP origin of this api server: default=http://localhost:3001',
 * - CLIENT_ORIGIN: 'the HTTP origin of the web app that uses this api server: default=http://localhost:3000',
 * - SESSIONS_COOKIE_NAME: 'the name of the cookie that will be sent to the browser: default=h95729',
 * - SESSIONS_ALGORITHM: 'The algorithm to use when signing cookies, JWTs, etc. (default: HS256)',
 * - SESSIONS_SECRETS: 'An array of key id / CPRNG secret pairs which are used to sign cookies, JWTs, etc.',
 * - SESSIONS_EXPIRE_IN_MS: 'Session Expiry in milliseconds (minimum 15 minutes), which koa\'s ctx.cookies.set requires',
 * - SESSIONS_EXPIRE_IN_S: 'Session Expiry in seconds, which jsonwebtoken requires (computed; based on SESSIONS_EXPIRE_IN_MS)',
 * - LOG_WRITER: 'the type of writer to emit logs to',
 * - LOG_FORMATTER: 'the type of formatter to format the logs with',
 * - LOG_EVENTS: 'The events to pipe to the default logger',
 * - PATH_TO_KEYV_DB: 'the path to the database file (e.g. sqlite://path/to/data.db)',
 * - PATH_TO_GRAPHQL_SCHEMA: 'the path to the GraphQL schema (e.g. schema/schema.graphql)',
 * @typedef {Object} IENVVARS
 * @property {string} NODE_ENV
 * @property {boolean} NODE_ENV_ENFORCE_SECURITY
 * @property {string} SERVER_VERSION
 * @property {number} SERVER_PORT
 * @property {string} [SERVER_PROXY_PREFIX]
 * @property {boolean} SERVER_IS_IN_PROXY
 * @property {string} SERVER_ORIGIN
 * @property {string} CLIENT_ORIGIN
 * @property {string} SESSIONS_COOKIE_NAME
 * @property {import('jsonwebtoken').Algorithm} SESSIONS_ALGORITHM
 * @property {IKidSecretPair[]} SESSIONS_SECRETS
 * @property {number} SESSIONS_EXPIRE_IN_MS
 * @property {number} SESSIONS_EXPIRE_IN_S
 * @property {string} LOG_WRITER
 * @property {string} LOG_FORMATTER
 * @property {string[]} LOG_EVENTS
 * @property {string} PATH_TO_KEYV_DB
 * @property {string} PATH_TO_GRAPHQL_SCHEMA
 */
