import path from 'node:path'
import { LogEmitter, writers, formatters } from '@polyn/logger'
import dotenv from 'dotenv'
import Keyv from 'keyv'
import { CompositeError } from '../../lib/errors'
import envvars from './typedefs/env'
import exit from './exit'
import type { appCtxSchema } from './typedefs/ctx-app-lifecycle'

/**
 * Creates a Keyv instance for the given namespace
 */
const makeRepo = (namespace: string, env: envvars, logger: LogEmitter) => {
  const repo = new Keyv(env.PATH_TO_KEYV_DB, {
    table: namespace,
    busyTimeout: 10000,
  })
  // new Keyv({
  //   namespace,
  //   store: new KeyvFile({
  //     filename: path.join(
  //       process.cwd(),
  //       'data',
  //       `heinz-95729-${namespace}.json`,
  //     ), // the file path to store the data
  //     writeDelay: 200, // milliseconds; batch write to disk in a specific duration, enhance write performance.
  //     encode: JSON.stringify, // serialize function
  //     decode: JSON.parse, // deserialize function
  //   }),
  // })

  repo.on('error', (err) => logger.emit('keyv_error', 'error', err))

  return repo
}

/**
 * Starts a promise chain and creates the context for the app. The context
 * will get returned by each step in the flow
 */
export const composeAppCtx = async (
  injectedContext: Partial<appCtxSchema> | undefined = {}
): Promise<appCtxSchema> => {
  try {
    process.on('uncaughtException', exit(process).using(console, Date))
    process.on('unhandledRejection', exit(process).using(console, Date))

    dotenv.config({
      path: process.env.CONFIG_PATH || path.resolve(process.cwd(), '.env'),
    })

    const env = envvars.parse({ ...process.env, ...injectedContext.env })
    const logger = injectedContext.logger || new LogEmitter()
    // @ts-ignore
    const logWriter = injectedContext.logWriter || new writers[env.LOG_WRITER]({
      // @ts-ignore
      formatter: new formatters[env.LOG_FORMATTER](),
    })
    const storage = injectedContext.storage || {
      users: makeRepo('users', env, logger),
      products: makeRepo('products', env, logger),
    }

    env.LOG_EVENTS.forEach((/** @type {string} */ event) =>
      // @ts-ignore
      logger.on(event, logWriter.listen),
    )

    logger.emit('compose_context_complete', 'trace', { cwd: process.cwd(), env })

    return {
      env,
      logger,
      storage,
    }
  } catch (cause: unknown) {
    throw new CompositeError('compose_context_failed', { cause })
  }
} // /compose_context

export default composeAppCtx
