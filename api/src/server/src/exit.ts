/**
 * Logs an error and exits the process.
 *
 * uncaughtExceptions should ALWAYS `process.exit(1)`. This is just a
 * placeholder for making sure we capture and/or log information about
 * the error that occurred. There is no guarantee that logging systems
 * are available, so we log to the console, and rely on devops to write
 * console logs somewhere.
 */
export const exit = (thread: typeof process) => {
  return {
    using: (consoleLogger: typeof console, timeProvider: typeof Date) => {
      /** @type {Exit} */
      return (err: Error) => {
        const _err = typeof err !== 'object'
          ? err                                       // not expected - use what we got
          : Object.keys(err).reduce((obj, key) => ({  // cast the error to something serializable
            ...obj,
            // @ts-expect-error -- TS doesn't like the console or Errors... but we use them
            ...{ [key]: (err)[key] },
          }), {
            message: err.message,
            stack: err.stack,
          })

        return [
          // eslint-disable-next-line no-console
          consoleLogger.error({ timestamp: timeProvider.now(), message: 'uncaught_error', err: _err }),
          thread.exit(1),
        ]
      }
    },
  }
}

export default exit
