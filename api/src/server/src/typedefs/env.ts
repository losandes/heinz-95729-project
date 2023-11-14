import { split, trim } from 'ramda'
import { z } from 'zod'

const ENV = {
  CICD: 'cicd',
  DEV: 'development',
  LOCAL: 'localhost',
  PROD: 'production',
  TEST: 'test',
}

const DESC = {
  NODE_ENV: 'the environment the app is running in: /^(local|test|development|production)$/',
  NODE_ENV_ENFORCE_SECURITY: 'whether or not to enforce secure configurations like HTTPS (computed; false when NODE_ENV is local or development)',
  SERVER_VERSION: 'the version as stated in the package.json file',
  SERVER_PORT: 'the port this app can be reached at: default=5173',
  SERVER_PROXY_PREFIX: 'optional path this api can be reached at when it\'s running in proxy mode',
  SERVER_IS_IN_PROXY: 'whether or not the app is running in proxy mode (computed; conditionally set to true when the value of SERVER_PROXY_PREFIX is not an empty string)',
  SERVER_ORIGIN: 'the HTTP origin of this api server: default=http://localhost:5173',
  CLIENT_ORIGIN: 'the HTTP origin of the web app that uses this api server: default=http://localhost:5173',
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

const KID_DESC = {
  KID: 'The key id of this secret',
  SECRET: 'a CPRNG of appropriate length for the algorithm being used to sign tokens (e.g. 256 bits / 32 chars for HS256; 512 bits / 64 chars for HS512)',
  EXPIRATION: 'An optional expiration time expressed as the number of milliseconds elapsed since midnight, January 1, 1970 Universal Coordinated Time (UTC) (e.g. `Date.now() + (86400000 * 30)`; `new Date(\'2023-04-01\').getTime()`',
}

const kidSecretPairs = z.object({
  KID: z.string().trim().min(32).describe(KID_DESC.KID),
  SECRET: z.string().trim().min(32).describe(KID_DESC.SECRET),
  EXPIRATION: z.union([z.number(), z.string()]) // can also use z.number().or(z.string())
    .optional()
    .pipe(z.coerce.number().positive().optional())
    .describe(KID_DESC.EXPIRATION),
})

type kidSecretPairs = z.infer<typeof kidSecretPairs>

/**
 * If the value is a string, attempts to coerce it from a
 * CSV to an array of strings
 */
const coerceStringArrayFromCsv = (value: string | string[], ctx: z.RefinementCtx) => {
  if (Array.isArray(value)) {
    return value
  } else if (typeof value === 'string') {
    return split(',')(value).map(trim)
  } else {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Expected {${typeof value}} to be a {string} or {string[]}`,
    })

    return z.NEVER
  }
}


/**
 * If the value is a string, this attempts to coerce it into
 * an array of kidSecretPairs
 */
const coerceKidSecretPairs = (value: string | kidSecretPairs[], ctx: z.RefinementCtx) => {
  if (Array.isArray(value)) {
    return value
  } else if (typeof value === 'string') {
    return split(',')(value).map(trim).map((s) => {
      const [kid, secret, expiration] = s.split(':')

      return {
        KID: kid?.trim(),
        SECRET: secret?.trim(),
        EXPIRATION: expiration ? Number(expiration.trim()) : undefined,
      }
    })
  } else {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Expected {${typeof value}} to be a {string} or {Array<{ KID: string, SECRET: string, EXPIRATION?: number }>}`,
    })

    return z.NEVER
  }
}

const baseEnv = z.object({
  SERVER_PORT: z.union([z.number(), z.string()]) // can also use z.number().or(z.string())
    .default(5173)
    .pipe(z.coerce.number().int().gt(0))
    .describe(DESC.SERVER_PORT),
  SERVER_PROXY_PREFIX: z.string().startsWith('/').trim().optional().describe(DESC.SERVER_PROXY_PREFIX),
  SERVER_ORIGIN: z.string().url().trim().default('http://localhost:5173').describe(DESC.SERVER_ORIGIN),
  CLIENT_ORIGIN: z.string().url().trim().default('http://localhost:5173').describe(DESC.CLIENT_ORIGIN),
  SESSIONS_COOKIE_NAME: z.string().trim().min(2).default('h95729s').describe(DESC.SESSIONS_COOKIE_NAME),
  SESSIONS_ALGORITHM: z.enum([
    'HS256', 'HS384', 'HS512',
    'RS256', 'RS384', 'RS512',
    'PS256', 'PS384', 'PS512',
    'ES256', 'ES384', 'ES512',
  ]).default('HS256').describe(DESC.SESSIONS_ALGORITHM),
  SESSIONS_SECRETS: z.union([z.string(), z.array(kidSecretPairs)]) // can also use z.string().or(z.array(kidSecretPairs))
    .transform(coerceKidSecretPairs)
    .pipe(z.array(kidSecretPairs))
    .describe(DESC.SESSIONS_SECRETS),
  SESSIONS_EXPIRE_IN_MS: z.union([z.string(), z.number()]) // can also use z.number().or(z.string())
    .default(86400000 * 30 /* 30 days */)
    .pipe(z.coerce.number().int().gte(900000 /* at least 15 minutes */))
    .describe(DESC.SESSIONS_EXPIRE_IN_MS),
  PATH_TO_KEYV_DB: z.string().trim().min(1).describe(DESC.PATH_TO_KEYV_DB),
  PATH_TO_GRAPHQL_SCHEMA: z.string().trim().min(1).describe(DESC.PATH_TO_GRAPHQL_SCHEMA),
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
  LOG_EVENTS: z.union([z.string(), z.string().array()]) // can also use z.string().or(z.string().array())
    .default(['info', 'warn', 'error', 'fatal'])
    .transform(coerceStringArrayFromCsv)
    .pipe(z.coerce.string().array())
    .describe(DESC.LOG_EVENTS),
})

const calculatedEnvvars = z.object({
  MODE: z.enum([ENV.LOCAL, ENV.DEV, ENV.TEST, ENV.PROD]).optional().describe(DESC.NODE_ENV),
  NODE_ENV: z.enum([ENV.LOCAL, ENV.DEV, ENV.TEST, ENV.PROD]).describe(DESC.NODE_ENV),
  SERVER_VERSION: z.string().trim().min(1).describe(DESC.SERVER_VERSION),
  NODE_ENV_ENFORCE_SECURITY: z.boolean().describe(DESC.NODE_ENV_ENFORCE_SECURITY),
  SERVER_IS_IN_PROXY: z.boolean().describe(DESC.SERVER_IS_IN_PROXY),
  SESSIONS_EXPIRE_IN_S: z.number().int().positive().describe(DESC.SESSIONS_EXPIRE_IN_S),
})

export const envvars = baseEnv.merge(calculatedEnvvars.partial()).transform((mutableValue) => {
  mutableValue.NODE_ENV = mutableValue.MODE ?? mutableValue.NODE_ENV ?? 'development'
  mutableValue.SERVER_VERSION = mutableValue.SERVER_VERSION || process?.env?.npm_package_version || '0.0.0'
  mutableValue.SERVER_IS_IN_PROXY = !!(mutableValue.SERVER_PROXY_PREFIX && mutableValue.SERVER_PROXY_PREFIX.length)
  mutableValue.NODE_ENV_ENFORCE_SECURITY = ![ENV.LOCAL, ENV.DEV].includes(mutableValue.NODE_ENV)
  mutableValue.SESSIONS_EXPIRE_IN_S = Math.floor(mutableValue.SESSIONS_EXPIRE_IN_MS / 1000)

  return mutableValue
}).pipe(baseEnv.merge(calculatedEnvvars))

export type envvars = z.infer<typeof envvars>

export default envvars
