import { split, trim } from 'ramda'
import { z } from 'zod'
import { CompositeError } from '@lib/errors'

const LogLevelOptions = z.enum(['off', 'trace', 'debug', 'info', 'warn', 'error'])
export const LogLevel = z.enum(['trace', 'debug', 'info', 'warn', 'error'])
export type LogLevel = z.infer<typeof LogLevel>

const stringToArray = (delimiter = ',') => (val: string) =>
  split(delimiter, val).map(trim)

const csvToArray = z.string()
  .transform(stringToArray())
  .pipe(z.string().array())

const logArray = z.string().array().optional()
  .default(['trace', 'debug', 'info', 'warn', 'error'])

const DESCRIBE = {
  // APP
  MODE: [
    'The mode the app is running in. Based on NODE_ENV or',
    'what is passed to vite in the `--mode` arg.'].join(' '),
  PUBLIC_API_ORIGIN: 'The protocol and host of the api server.',
  // LOGGING
  PUBLIC_LOG_LEVELS: [
    'The log levels that will be output to the console. Based on the ENVVARs',
    'which can be overriden by setting the log-verbosity key in sessionStorage.',
  ].join(' '),
}

const modeSchema = z.enum([
  'development', 'cicd', 'localhost', 'production', 'test',
]).describe(DESCRIBE.MODE)

/**
 * The environment variables that are used by the app. This consumes
 * `import.meta.env` and validates the ENVVARs that are required for the
 * app to run properly.
 *
 * @important The keys must be prefixed with PUBLIC if they are required.
 *            This ENV object is used in the browser and only keys with
 *            the PUBLIC prefix will be available to the browser environement.
 * @important The keys in this object must match the keys in the .env
 *            or .envrc files (or wherever the environment variables are set).
 * @note      This is the only file in the app that should use
 *            `import.meta.env`. If you need to use `import.meta.env` in
 *            another file, you should import this file instead. If the
 *            ENVVAR you need isn't here yet, add it.
 *
 * @example
 *
 * ```ts
 * import env from './lib/env/index.ts'
 * import log from './lib/logger/index.ts'
 *
 * log.emit('info', 'PUBLIC_APP_VERSION', {
 *   PUBLIC_APP_VERSION: env.PUBLIC_APP_VERSION
 * }) // => prints 'a1b2c3d4' to the console
 * ```
 */
const ENV = z.object({
  // APP
  MODE: modeSchema,
  PUBLIC_MODE: modeSchema,
  PUBLIC_API_ORIGIN: z.string().url().optional()
    .default('http://localhost:8000')
    .describe(DESCRIBE.PUBLIC_API_ORIGIN),
  // LOGGING
  PUBLIC_LOG_LEVELS: logArray.or(csvToArray)
    .pipe(LogLevelOptions.array())
    .transform((val) => val.filter((v) => v !== 'off'))
    .pipe(LogLevel.array().min(0))
    .describe(DESCRIBE.PUBLIC_LOG_LEVELS),
})

export type ENV = z.infer<typeof ENV>
const _env = ENV.partial()
  .transform((mutableValue) => {
    mutableValue.PUBLIC_MODE = mutableValue.MODE
    return mutableValue
  })
  .pipe(ENV)
  .safeParse(import.meta.env)

// eslint-disable-next-line functional/no-conditional-statements
if (!_env.success) {
  const err = new CompositeError(
    'ENVVARs are invalid (src/lib/env)',
    { cause: _env.error },
  )

  // eslint-disable-next-line no-console
  console.error({ err })
}

// fall back to import.meta.env if the ENVVARs are invalid
// that will put us in a partially working state, which
// might not be ideal, though.
export const env = (_env.success ? _env.data : import.meta.env) as ENV
export default env
