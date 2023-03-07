import {
  is,
  optional,
  registerValidator,
  registerBlueprint,
  required,
} from '@polyn/blueprint'
import { immutable } from '@polyn/immutable'

registerValidator('256bitString', ({ key, value }) => {
  if (
    typeof value === 'string' &&
    Buffer.byteLength(value.trim(), 'utf8') >= 32 // 32 utf8 chars = 256 bits
  ) {
    return { value }
  }

  return { err: new Error(`expected \`${key}\` {${is.getType(value)}} to be a {string} of 256 or more bits (32 or more utf8 chars)`) }
})

const envvarsBlueprint = {
  NODE_ENV: /^(local|test|development|production)$/,
  NODE_ENV_OPTIONS: required('any').from(() => ({
    LOCAL: 'local',
    TEST: 'test',
    DEV: 'development',
    PROD: 'production',
  })),
  /**
   * This ENVVAR is used to turn dev features on and off, such as
   * GraphiQL, and the Content-Security-Policies that go with that
   */
  ALLOW_DEV_CONFIGURATIONS: optional('boolean').from(({ output }) => [
    output.NODE_ENV_OPTIONS.LOCAL,
    output.NODE_ENV_OPTIONS.DEV,
  ].includes(output.NODE_ENV)),
  ENFORCE_HTTPS: optional('boolean').from(({ output }) => !output.ALLOW_DEV_CONFIGURATIONS),
  APP_VERSION: required('string').from(({ value, input }) => value || input.npm_package_version),
  PORT: optional('string').withDefault('3000'),
  ROUTER_PREFIX: optional('string').withDefault(''),
  /**
   * When the app is in proxy, we have to set a flag in koa so it will set
   * secure cookies (required IFF the app is in a proxy). Also turns on koa
   * support for translating "X-Forwarded-For" headers to the consumer's
   * IP Address for logging.
   */
  APP_IS_IN_PROXY: required('boolean').from(({ output }) =>
    !!(typeof output.ROUTER_PREFIX && output.ROUTER_PREFIX.length)),
  WEB_APP_ORIGIN: required('string').from(({ value, output }) => {
    if (is.string(value)) {
      return value
    }

    switch (output.NODE_ENV) {
      case output.NODE_ENV_OPTIONS.PROD:
        return 'http://localhost:3001'
      case output.NODE_ENV_OPTIONS.DEV:
        return 'http://localhost:3001'
      case output.NODE_ENV_OPTIONS.TEST:
        return 'http://localhost:3001'
      default: // local
        return 'http://localhost:3001'
    }
  }),
  CORS_ORIGIN: optional('string').from(({ value, output }) => is.string(value) ? value : output.WEB_APP_ORIGIN),
  JWT_COOKIE_NAME: optional('string').withDefault('h95729s'),
  JWT_SECRET: '256bitString',
  /** JWT Expiry in the format that jsonwebtoken wants it: make sure it matches  JWT_EXPIRES_IN_MS! */
  JWT_EXPIRES_IN: optional('string').withDefault('30d'),
  /** Cookie Expiry in the millisecond format that koa's ctx.cookies.set wants it: make sure it matches JWT_EXPIRES_IN! */
  JWT_EXPIRES_IN_MS: optional('number').withDefault(86400000 * 30 /* 30 days */),
  LOG_WRITER: required(/^(ArrayWriter|ConsoleWriter|DevConsoleWriter|StdoutWriter)$/).from(({ value, output }) => {
    if (is.string(value)) {
      return value
    }

    switch (output.NODE_ENV) {
      case output.NODE_ENV_OPTIONS.PROD:
        return 'StdoutWriter'
      case output.NODE_ENV_OPTIONS.DEV:
        return 'StdoutWriter'
      case output.NODE_ENV_OPTIONS.TEST:
        return 'ArrayWriter'
      default: // local
        return 'DevConsoleWriter'
    }
  }),
  LOG_FORMATTER: required(/^(BlockFormatter|BunyanFormatter|JsonFormatter|PassThroughFormatter|StringFormatter|SquashFormatter)$/)
    .from(({ value, output }) => {
      if (is.string(value)) {
        return value
      }

      switch (output.NODE_ENV) {
        case output.NODE_ENV_OPTIONS.PROD:
          return 'SquashFormatter'
        case output.NODE_ENV_OPTIONS.DEV:
          return 'SquashFormatter'
        case output.NODE_ENV_OPTIONS.TEST:
          return 'PassThroughFormatter'
        default: // local
          return 'BlockFormatter'
      }
    }),
  LOG_LISTENERS: required('string[]').from(({ value, output }) => {
    if (is.string(value)) {
      return value.split(',').map((/** @type {string} */ s) => s.trim())
    }

    /**
     * Example listeners:
     * // metrics
     * 'count',
     * 'error_count',
     * 'gauge_increase',
     * 'gauge_decrease',
     * 'latency',
     * // audit trail
     * // (i.e. events that should be auditable, such as access to, or modification of PII)
     * 'audit_info',
     * 'audit_warn',
     * // only acceptable on local dev
     * // (i.e. debug secrets without risking accidental logging in master)
     * 'local',
     * 'todo',
     * // intended for programmatic testing
     * // (i.e. debug private/encapsulated code, sequences, etc.)
     * 'test',
     * // standard logging fare (events)
     * 'trace',
     * 'debug',
     * 'info',
     * 'warn',
     * 'error',
     * 'fatal',
     */

    switch (output.NODE_ENV) {
      case output.NODE_ENV_OPTIONS.PROD:
        return ['info', 'warn', 'error', 'fatal']
      case output.NODE_ENV_OPTIONS.DEV:
        return ['debug', 'info', 'warn', 'error', 'fatal']
      case output.NODE_ENV_OPTIONS.TEST:
        return ['test', 'local', 'todo', 'trace', 'debug', 'info', 'warn', 'error', 'fatal']
      default: // local
        // return ['*'] // all events
        return ['local', 'todo', 'trace', 'debug', 'info', 'warn', 'error', 'fatal']
    }
  }),
  PATH_TO_KEYV_DB: 'string',
  PATH_TO_GRAPHQL_SCHEMA: 'string',
}

registerBlueprint('ENVVARS', envvarsBlueprint)

/** @type {_ENVVARS} */
const _ENVVARS = immutable('ENVVARS', envvarsBlueprint)

/** @type {ENVVARS} */
export default class Envvars extends _ENVVARS {
  static blueprint = envvarsBlueprint
}
