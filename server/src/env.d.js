/**
 * #IENVVARS
 * The environment variables used to configure the app and
 * requests to the app.
 *
 * - NODE_ENV: 'the environment the app is running in: /^(local|test|development|production)$/',
 * - NODE_ENV_OPTIONS: 'constants for conditionally addressing NODE_ENV: LOCAL, TEST, DEV, PROD',
 * - APP_VERSION: 'the version as stated in the package.json file',
 * - ALLOW_DEV_CONFIGURATIONS: 'Used to turn dev features on and off, such as GraphiQL, and the Content-Security-Policies that go with that',
 * - ENFORCE_HTTPS: 'whether or not to enforce HTTPS or allow HTTP requests',
 * - PORT: 'the port this app can be reached at: default=3001',
 * - ROUTER_PREFIX: 'optional path this api can be reached at when it\'s running in proxy mode',
 * - APP_IS_IN_PROXY: 'whether or not the app is running in proxy mode: conditionally set to true when the value of ROUTER_PREFIX is not an empty string',
 * - WEB_APP_ORIGIN: 'the HTTP origin of the web app that uses this api: default=http://localhost:3001',
 * - CORS_ORIGIN: 'the HTTP origin to allow with CORS: default={WEB_APP_ORIGIN}',
 * - JWT_COOKIE_NAME: 'the name of the cookie that will be sent to the browser: default=h95729',
 * - JWT_SECRET: 'a 256+ bit (32+ char) cryptographic secret to sign JWT tokens with',
 * - JWT_EXPIRES_IN: 'JWT Expiry in the format that jsonwebtoken wants it: make sure it matches  JWT_EXPIRES_IN_MS!',
 * - JWT_EXPIRES_IN_MS: 'Cookie Expiry in the millisecond format that koa\'s ctx.cookies.set wants it: make sure it matches JWT_EXPIRES_IN! ',
 * - LOG_WRITER: 'the typeof writer to emit logs to',
 * - LOG_FORMATTER: 'the typeof formatter to format the logs with',
 * - LOG_LISTENERS: 'The events to pipe to the default logger',
 * - PATH_TO_KEYV_DB: 'the path to the database file (e.g. sqlite://path/to/data.db)',
 * - PATH_TO_GRAPHQL_SCHEMA: 'the path to the GraphQL schema (e.g. schema/schema.graphql)',
 * @typedef {Object} IENVVARS
 * @property {string} NODE_ENV
 * @property {INodeEnvOptions} NODE_ENV_OPTIONS
 * @property {boolean} ENFORCE_HTTPS
 * @property {boolean} ALLOW_DEV_CONFIGURATIONS
 * @property {string} APP_VERSION
 * @property {string} PORT
 * @property {string} ROUTER_PREFIX
 * @property {boolean} APP_IS_IN_PROXY
 * @property {string} WEB_APP_ORIGIN
 * @property {string} CORS_ORIGIN
 * @property {string} JWT_COOKIE_NAME
 * @property {string} JWT_SECRET
 * @property {string} JWT_EXPIRES_IN
 * @property {number} JWT_EXPIRES_IN_MS
 * @property {string} LOG_WRITER
 * @property {string} LOG_FORMATTER
 * @property {string[]} LOG_LISTENERS
 * @property {string} PATH_TO_KEYV_DB
 * @property {string} PATH_TO_GRAPHQL_SCHEMA
 */

/**
 * # INodeEnvOptions
 * Constants for conditionally addressing NODE_ENV. Over
 * the years, I found a lot of bugs where an environment
 * was named "development" and developers wrote conditions
 * like, `if (process.env.NODE_ENV === 'dev')`. This is
 * intended to be used to avoid those bugs.
 * @typedef {Object} INodeEnvOptions
 * @property {string} LOCAL
 * @property {string} DEV
 * @property {string} TEST
 * @property {string} PROD
 */

/**
 * The static properties defined on ENVVARS
 * @typedef {Object} _ENVVARSStaticProps
 * @property {any} schema
 */

/**
 * The constructor for ENVVARS
 * @typedef {new (envvars: any) => IENVVARS} _ENVVARS
 */

/**
 * The ENVVARS class
 * @typedef {_ENVVARS & _ENVVARSStaticProps} ENVVARS
 */
