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
const exit = (err) => {
  const _err = typeof err !== 'object'
    ? err                                                                       // not expected - use what we got
    : Object.keys(err).reduce((obj, key) => {                                   // cast the error to something serializable
      obj[key] = err[key]

      return obj
    }, {
      message: err.message,
      stack: err.stack,
    })

  // eslint-disable-next-line no-console
  console.error({ timestamp: Date.now(), message: 'uncaught_error', err: _err })
  process.exit(1)
}

module.exports = exit
