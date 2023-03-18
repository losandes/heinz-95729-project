import { immutable } from '@heinz-95729/immutable'
import { z } from 'zod'

const DESC = {
  NODE_ENV: 'the environment the app is running in: /^(local|test|development|production)$/',
  NODE_ENV_OPTIONS: 'constants for conditionally addressing NODE_ENV: LOCAL, TEST, DEV, PROD',
  APP_VERSION: 'the version as stated in the package.json file',
  ALLOW_DEV_CONFIGURATIONS: 'Used to turn dev features on and off, such as GraphiQL, and the Content-Security-Policies that go with that',
  ENFORCE_HTTPS: 'whether or not to enforce HTTPS or allow HTTP requests',
  PORT: 'the port this app can be reached at: default=3001',
  ROUTER_PREFIX: 'optional path this api can be reached at when it\'s running in proxy mode',
  APP_IS_IN_PROXY: 'whether or not the app is running in proxy mode: conditionally set to true when the value of ROUTER_PREFIX is not an empty string',
  WEB_APP_ORIGIN: 'the HTTP origin of the web app that uses this api: default=http://localhost:3001',
  CORS_ORIGIN: 'the HTTP origin to allow with CORS: default={WEB_APP_ORIGIN}',
  JWT_COOKIE_NAME: 'the name of the cookie that will be sent to the browser: default=h95729',
  JWT_SECRET: 'a 256+ bit (32+ char) cryptographic secret to sign JWT tokens with',
  JWT_EXPIRES_IN: 'JWT Expiry in the format that jsonwebtoken wants it: make sure it matches  JWT_EXPIRES_IN_MS!',
  JWT_EXPIRES_IN_MS: 'Cookie Expiry in the millisecond format that koa\'s ctx.cookies.set wants it: make sure it matches JWT_EXPIRES_IN! ',
  LOG_WRITER: 'the typeof writer to emit logs to',
  LOG_FORMATTER: 'the typeof formatter to format the logs with',
  LOG_LISTENERS: 'The events to pipe to the default logger',
  PATH_TO_KEYV_DB: 'the path to the database file (e.g. sqlite://path/to/data.db)',
  PATH_TO_GRAPHQL_SCHEMA: 'the path to the GraphQL schema (e.g. schema/schema.graphql)',
}

const baseEnv = z.object({
  NODE_ENV: z.enum(['local', 'development', 'test', 'production'])
    .describe(DESC.NODE_ENV),
  PORT: z.union([z.number(), z.string()]).default(3001)
    .pipe(z.coerce.number().int().gt(0))
    .describe(DESC.PORT),
  ROUTER_PREFIX: z.string().startsWith('/').trim().optional().describe(DESC.ROUTER_PREFIX),
  WEB_APP_ORIGIN: z.string().url().trim().default('http://localhost:3001').describe(DESC.WEB_APP_ORIGIN),
  JWT_COOKIE_NAME: z.string().trim().default('h95729s').describe(DESC.JWT_COOKIE_NAME),
  JWT_SECRET: z.string().min(32).trim().describe(DESC.JWT_SECRET),
  JWT_EXPIRES_IN: z.string().min(2).trim().default('30d').describe(DESC.JWT_EXPIRES_IN),
  JWT_EXPIRES_IN_MS: z.number().int().positive().default(86400000 * 30 /* 30 days */).describe(DESC.JWT_EXPIRES_IN_MS),
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
  LOG_LISTENERS: z.union([z.string(), z.string().array()])
    .default(['info', 'warn', 'error', 'fatal'])
    .transform((value) => {
      if (Array.isArray(value)) {
        return value
      } else if (typeof value === 'string') {
        return value.split(',').map((/** @type {string} */ s) => s.trim())
      } else {
        throw new Error(`Expected {${typeof value}} to be a {string} or {string[]}`)
      }
    })
    .pipe(z.coerce.string().array())
    .describe(DESC.LOG_LISTENERS),
})

const calculatedEnvvars = z.object({
  NODE_ENV_OPTIONS: z.object({
    LOCAL: z.string().min(3).trim(),
    TEST: z.string().min(3).trim(),
    DEV: z.string().min(3).trim(),
    PROD: z.string().min(3).trim(),
  }).default({
    LOCAL: 'local',
    TEST: 'test',
    DEV: 'development',
    PROD: 'production',
  }).describe(DESC.NODE_ENV_OPTIONS),
  APP_VERSION: z.string().min(2).trim().optional().describe(DESC.APP_VERSION),
  ALLOW_DEV_CONFIGURATIONS: z.boolean().optional().describe(DESC.ALLOW_DEV_CONFIGURATIONS),
  ENFORCE_HTTPS: z.boolean().optional().describe(DESC.ENFORCE_HTTPS),
  APP_IS_IN_PROXY: z.boolean().optional().describe(DESC.APP_IS_IN_PROXY),
  CORS_ORIGIN: z.string().url().trim().optional().describe(DESC.CORS_ORIGIN),
})

export const envSchema = baseEnv.merge(calculatedEnvvars).transform((value) => {
  value.APP_VERSION = value.APP_VERSION || process?.env?.npm_package_version
  value.APP_IS_IN_PROXY = !!(value.ROUTER_PREFIX && value.ROUTER_PREFIX.length)
  value.CORS_ORIGIN = value.CORS_ORIGIN || value.WEB_APP_ORIGIN
  value.ALLOW_DEV_CONFIGURATIONS = [
    value.NODE_ENV_OPTIONS.LOCAL,
    value.NODE_ENV_OPTIONS.DEV,
  ].includes(value.NODE_ENV)
  value.ENFORCE_HTTPS = !value.ALLOW_DEV_CONFIGURATIONS

  return value
})

/** @type {_ENVVARS} */
const _ENVVARS = immutable('ENVVARS', envSchema)

/** @type {ENVVARS} */
export default class Envvars extends _ENVVARS {
  static schema = envSchema
}
