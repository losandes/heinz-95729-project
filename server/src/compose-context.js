import dotenv from 'dotenv'
import Keyv from 'keyv'
import path from 'node:path'
import { LogEmitter, writers, formatters } from '@polyn/logger'

import exitWith from './exit.js'
import envvars from './env.js'
import StartupError from './StartupError.js'

/**
 * @param {string} namespace
 * @param {IENVVARS} env
 * @param {import('@polyn/logger').LogEmitter} logger
 * @returns {IStorage}
 */
const makeRepo = (namespace, env, logger) => {
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

  repo.on('error',
    (/** @type {any} */ err) => logger.emit('keyv_error', 'error', err))

  return repo
}

/**
 * Starts a promise chain and creates the context for the app. The context
 * will get returned by each step in the flow
 * @param {IPartialAppContext} [injectedContext] optional context object
 * @returns {Promise<IAppContext>}
 */
export const composeContext = async (injectedContext = {}) => {
  try {
    process.on('uncaughtException', exitWith(process, console, Date))
    process.on('unhandledRejection', exitWith(process, console, Date))

    dotenv.config({ path: process.env.CONFIG_PATH || path.resolve(process.cwd(), '.env') })

    const env = envvars.parse({ ...process.env, ...injectedContext.env })
    const resolverFactories = injectedContext.resolverFactories || []
    const routes = injectedContext.routes || []
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
      resolverFactories,
      routes,
      storage,
    }
  } catch (/** @type {any} */ e) {
    throw new StartupError('compose_context_failed', e)
  }
} // /compose_context
