/**
 * @typedef {Object} IENVVARS
 * @property {string} NODE_ENV - /^(local|test|development|production)$/
 * @property {{
*   LOCAL: string
*   DEV: string
*   TEST: string
*   PROD: string
* }} NODE_ENV_OPTIONS - default={ LOCAL: 'local', DEV: 'development', TEST: 'test', PROD: 'production' }
* @property {string} APP_VERSION
* @property {string} PORT - default='3001'
* @property {string} ROUTER_PREFIX - default=''
* @property {boolean} APP_IS_IN_PROXY - true if the ROUTER_PREFIX is a string with length > 0
* @property {string} WEB_APP_ORIGIN - default='http://localhost:3001'
* @property {string} CORS_ORIGIN - default=`${WEB_APP_ORIGIN}`
* @property {string} JWT_COOKIE_NAME - default='rnpfc'
* @property {string} JWT_SECRET - must be at least 32 characters
* @property {string} JWT_EXPIRES_IN - default='30d'
* @property {number} JWT_EXPIRES_IN_MS - default=(86400000 * 30) (30 days)
* @property {string} LOG_WRITER - default='DevConsoleWriter'] - /^(ArrayWriter|ConsoleWriter|DevConsoleWriter|StdoutWriter)$/
* @property {string} LOG_FORMATTER - default='BlockFormatter'] - /^(BlockFormatter|BunyanFormatter|JsonFormatter|PassThroughFormatter|StringFormatter|SquashFormatter)$/
* @property {string[]} LOG_LISTENERS - default=['local', 'todo', 'trace', 'debug', 'info', 'warn', 'error', 'fatal']]
* @property {string} PATH_TO_KEYV_DB - default 'sqlite://path/to/database.sqlite'
* @property {string} PATH_TO_GRAPHQL_SCHEMA - default='src/schema/schema.graphql']
*/

/**
* @typedef {Object} _ENVVARSStaticProps
* @property {any} blueprint
*/

/**
* @typedef {new (envvars: any) => IENVVARS} _ENVVARS
*/

/**
* @typedef {_ENVVARS & _ENVVARSStaticProps} ENVVARS
*/
