// eslint-disable-next-line functional/no-classes
export default class StartupError extends Error {
  /**
   * @param {string} step
   * @param {Error | any} cause
   */
  constructor (step, cause) {
    super(step)

    // maintains proper stack trace for where our error was thrown
    typeof Error?.captureStackTrace === 'function' &&
      Error.captureStackTrace(this, StartupError)

    // cast the error to something serializable
    this.cause = Object.keys(cause).reduce(
      (err, key) => {
        return {
          ...err,
          ...{ [key]: cause[key] },
        }
      }, {
        message: cause.message,
        stack: cause.stack,
      })
  }
}
