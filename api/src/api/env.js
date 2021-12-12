/**
 * @param {@polyn/blueprint} blueprint
 * @param {@polyn/immutable} immutable
 */
function EnvvarsFactory (deps) {
  'use strict'

  const { is, optional, registerValidator, required } = deps.blueprint
  const { immutable } = deps.immutable

  registerValidator('256bitString', ({ key, value }) => {
    if (
      typeof value === 'string' &&
      Buffer.byteLength(value.trim(), 'utf8') >= 32 // 32 utf8 chars = 256 bits
    ) {
      return { value }
    }

    return { err: new Error(`expected \`${key}\` {${is.getType(value)}} to be a {string} of 256 or more bits (32 or more utf8 chars)`) }
  })

  const Envvars = immutable('Envvars', {
    NODE_ENV: /^(local|test|development|production)$/,
    NODE_ENV_OPTIONS: required('any').from(() => ({
      LOCAL: 'local',
      TEST: 'test',
      DEV: 'development',
      PROD: 'production',
    })),
    APP_VERSION: 'string',
    PORT: optional('string').withDefault('3000'),
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
    JWT_COOKIE_NAME: optional('string').withDefault('h9'),
    JWT_SECRET: '256bitString',
    JWT_EXPIRES_IN: optional('string').withDefault('30d'),
    JWT_EXPIRES_IN_MS: optional('number')                  // the number of milliseconds in the future cookies/jwts should expire
      .withDefault(86400000 * 30 /* 30 days */),
    DB_HOST: optional('string').withDefault('0.0.0.0'),
    DB_PORT: optional('string').withDefault('5432'),
    DB_NAME: optional('string').withDefault('node_app'),
    DB_USER: 'string?',
    DB_PASSWORD: 'string?',
    DB_CONNECTION_STRING: optional('string').from(({ value, output }) => {
      if (value) {
        return value
      } else if (output.DB_PASSWORD) {
        const sslmode = output.NODE_ENV === output.NODE_ENV_OPTIONS.LOCAL ? 'disable' : 'require'
        return `postgresql://${output.DB_USER}:${output.DB_PASSWORD}@${output.DB_HOST}:${output.DB_PORT}/${output.DB_NAME}?sslmode=${sslmode}`
      }
    }),
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
    LOG_FORMATTER: required(/^(BlockFormatter|BunyanFormatter|JsonFormatter|PassThroughFormatter|StringFormatter|SquashFormatter)$/).from(({ value, output }) => {
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
        return value.split(',').map((s) => s.trim())
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
  })

  return { Envvars }
}

module.exports = EnvvarsFactory
