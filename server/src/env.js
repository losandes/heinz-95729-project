import { z } from 'zod'

const ENV = {
  LOCAL: 'local',
  TEST: 'test',
  DEV: 'development',
  PROD: 'production',
}

const DESC = {
  NODE_ENV: 'the environment the app is running in: /^(local|test|development|production)$/',
  NODE_ENV_ENFORCE_SECURITY: 'whether or not to enforce secure configurations like HTTPS (computed; false when NODE_ENV is local or development)',
  SERVER_VERSION: 'the version as stated in the package.json file',
  SERVER_PORT: 'the port this app can be reached at: default=3001',
  SERVER_PROXY_PREFIX: 'optional path this api can be reached at when it\'s running in proxy mode',
  SERVER_IS_IN_PROXY: 'whether or not the app is running in proxy mode (computed; conditionally set to true when the value of SERVER_PROXY_PREFIX is not an empty string)',
  SERVER_ORIGIN: 'the HTTP origin of this api server: default=http://localhost:3001',
  CLIENT_ORIGIN: 'the HTTP origin of the web app that uses this api server: default=http://localhost:3000',
  SESSIONS_COOKIE_NAME: 'the name of the cookie that will be sent to the browser: default=h95729',
  SESSIONS_ALGORITHM: 'The algorithm to use when signing cookies, JWTs, etc. (default: HS256)',
  SESSIONS_SECRETS: 'An array of key id / CPRNG secret pairs which are used to sign cookies, JWTs, etc.',
  SESSIONS_EXPIRE_IN_MS: 'Session Expiry in milliseconds (minimum 15 minutes), which koa\'s ctx.cookies.set requires',
  SESSIONS_EXPIRE_IN_S: 'Session Expiry in seconds, which jsonwebtoken requires (computed; based on SESSIONS_EXPIRE_IN_MS)',
  LOG_WRITER: 'the type of writer to emit logs to',
  LOG_FORMATTER: 'the type of formatter to format the logs with',
  LOG_EVENTS: 'The events to pipe to the default logger',
  PATH_TO_KEYV_DB: 'the path to the database file (e.g. sqlite://path/to/data.db)',
  PATH_TO_GRAPHQL_SCHEMA: 'the path to the GraphQL schema (e.g. schema/schema.graphql)',
}

const kidSecretPairs = z.object({
  kid: z.string().min(32).trim().describe('The key id of this secret'),
  secret: z.string().min(32).trim().describe('the CPRNG'),
  expiration: z.number().or(z.string()) // can also use z.union([z.number(), z.string()])
    .optional()
    .pipe(z.coerce.number().positive().optional())
    .describe('An optional expiration time based on `Date.now()`'),
})

const baseEnv = z.object({
  NODE_ENV: z.enum([ENV.LOCAL, ENV.DEV, ENV.TEST, ENV.PROD])
    .describe(DESC.NODE_ENV),
  SERVER_PORT: z.number().or(z.string()) // can also use z.union([z.number(), z.string()])
    .default(3001)
    .pipe(z.coerce.number().int().gt(0))
    .describe(DESC.SERVER_PORT),
  SERVER_PROXY_PREFIX: z.string().startsWith('/').trim().optional().describe(DESC.SERVER_PROXY_PREFIX),
  SERVER_ORIGIN: z.string().url().trim().default('http://localhost:3001').describe(DESC.SERVER_ORIGIN),
  CLIENT_ORIGIN: z.string().url().trim().default('http://localhost:3000').describe(DESC.CLIENT_ORIGIN),
  SESSIONS_COOKIE_NAME: z.string().trim().default('h95729s').describe(DESC.SESSIONS_COOKIE_NAME),
  SESSIONS_ALGORITHM: z.enum([
    'HS256', 'HS384', 'HS512',
    'RS256', 'RS384', 'RS512',
    'PS256', 'PS384', 'PS512',
    'ES256', 'ES384', 'ES512',
  ]).default('HS256').describe(DESC.SESSIONS_ALGORITHM),
  SESSIONS_SECRETS: z.string().or(z.array(kidSecretPairs)) // can also use z.union([z.string(), z.array(kidSecretPairs)])
    .transform((value, ctx) => {
      if (Array.isArray(value)) {
        return value
      } else if (typeof value === 'string') {
        return value.split(',').map((/** @type {string} */ s) => {
          const [kid, secret, expiration] = s.split(':')

          return { kid, secret, expiration }
        })
      } else {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Expected {${typeof value}} to be a {string} or {Array<{ kid: string, secret: string }>}`,
        })

        return z.NEVER
      }
    })
    .pipe(z.array(kidSecretPairs))
    .describe(DESC.SESSIONS_SECRETS),
  SESSIONS_EXPIRE_IN_MS: z.number().or(z.string()) // can also use z.union([z.string(), z.number()])
    .default(86400000 * 30 /* 30 days */)
    .pipe(z.coerce.number().int().gte(900000 /* at least 15 minutes */))
    .describe(DESC.SESSIONS_EXPIRE_IN_MS),
  PATH_TO_KEYV_DB: z.string().trim().describe(DESC.PATH_TO_KEYV_DB),
  PATH_TO_GRAPHQL_SCHEMA: z.string().trim().describe(DESC.PATH_TO_GRAPHQL_SCHEMA),
  LOG_WRITER: z.enum([
    'ArrayWriter',
    'ConsoleWriter',
    'DevConsoleWriter',
    'StdoutWriter',
  ]).default('StdoutWriter')
    .describe(DESC.LOG_WRITER),
  LOG_FORMATTER: z.enum([
    'BlockFormatter',
    'BunyanFormatter',
    'JsonFormatter',
    'PassThroughFormatter',
    'StringFormatter',
    'SquashFormatter',
  ]).default('SquashFormatter')
    .describe(DESC.LOG_FORMATTER),
  LOG_EVENTS: z.string().or(z.string().array()) // can also use z.union([z.string(), z.string().array()])
    .default(['info', 'warn', 'error', 'fatal'])
    .transform((value, ctx) => {
      if (Array.isArray(value)) {
        return value
      } else if (typeof value === 'string') {
        return value.split(',').map((/** @type {string} */ s) => s.trim())
      } else {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Expected {${typeof value}} to be a {string} or {string[]}`,
        })

        return z.NEVER
      }
    })
    .pipe(z.coerce.string().array())
    .describe(DESC.LOG_EVENTS),
})

const calculatedEnvvars = z.object({
  SERVER_VERSION: z.string().min(2).trim().optional().default('0.0.0').describe(DESC.SERVER_VERSION),
  NODE_ENV_ENFORCE_SECURITY: z.boolean().optional().default(true).describe(DESC.NODE_ENV_ENFORCE_SECURITY),
  SERVER_IS_IN_PROXY: z.boolean().optional().default(false).describe(DESC.SERVER_IS_IN_PROXY),
  SESSIONS_EXPIRE_IN_S: z.number().int().positive().optional().default(2592000).describe(DESC.SESSIONS_EXPIRE_IN_S),
})

export const envvars = baseEnv.merge(calculatedEnvvars).transform((mutableValue) => {
  mutableValue.SERVER_VERSION = mutableValue.SERVER_VERSION || process?.env?.npm_package_version || '0.0.0'
  mutableValue.SERVER_IS_IN_PROXY = !!(mutableValue.SERVER_PROXY_PREFIX && mutableValue.SERVER_PROXY_PREFIX.length)
  mutableValue.NODE_ENV_ENFORCE_SECURITY = ![ENV.LOCAL, ENV.DEV].includes(mutableValue.NODE_ENV)
  mutableValue.SESSIONS_EXPIRE_IN_S = Math.floor(mutableValue.SESSIONS_EXPIRE_IN_MS / 1000)

  return mutableValue
})

export default envvars
