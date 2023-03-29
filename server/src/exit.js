/**
 * Produces a function that logs an error and exits the process.
 * @curried
 * @param {{ exit: (code?: number | undefined) => never}} process
 * @param {{ error: (message?: any, ...optionalParams: any[]) => void }} console
 * @param {{ now: () => number }} Date
 * @returns {(err: Error) => void}
 */
export const exitFactory = (process, console, Date) => {
  /**
   * Logs an error and exits the process.
   *
   * uncaughtExceptions should ALWAYS `process.exit(1)`. This is just a
   * placeholder for making sure we capture and/or log information about
   * the error that occurred. There is no guarantee that logging systems
   * are available, so we log to the console, and rely on devops to write
   * console logs somewhere.
   * @param {Error} err - the error that was thrown
   */
  return (err) => {
    const _err = typeof err !== 'object'
      ? err                                       // not expected - use what we got
      : Object.keys(err).reduce((obj, key) => ({  // cast the error to something serializable
        ...obj,
        ...{ [key]: /** @type {any} */ (err)[key] },
      }), {
        message: err.message,
        stack: err.stack,
      })

    return [
      // eslint-disable-next-line no-console
      console.error({ timestamp: Date.now(), message: 'uncaught_error', err: _err }),
      process.exit(1),
    ]
  }
}

export default exitFactory
