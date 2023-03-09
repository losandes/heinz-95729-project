import * as loggerpkg from '@polyn/logger'

const { VITE_LOG_LISTENERS } = import.meta.env
const { LogEmitter, writers, formatters } = loggerpkg

/**
 * Singleton instance of a logger
 * @type {import('@polyn/logger').LogEmitter}
 */
export const logger = new LogEmitter(null)
export default logger

const logWriter = {
  listen: (/** @type {{ category: any; event: any; }} */ meta, /** @type {any} */ ...args) => {
    console.log(meta.category, meta.event, ...args)
  }
}

// subscribe to multiple categories
;VITE_LOG_LISTENERS.split(',').forEach(
  // @ts-ignore
  (category) => logger.on(category, logWriter.listen)
)

/**
 * Makes an instance of @polyn/logger that listens to everything,
 * prints nothing, and collects logs in an array that can be evaluated
 * @returns {import('@polyn/logger').LogEmitter} an instance of a logger
 */
export const makeTestLogger = () => {
  const testLogger = new LogEmitter(null)
  const logWriter = new writers.ArrayWriter({
    formatter: new formatters.PassThroughFormatter(),
  })

  // @ts-ignore
  testLogger.on('*', logWriter.listen)

  return testLogger
}
