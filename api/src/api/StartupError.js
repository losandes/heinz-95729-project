class StartupError extends Error {
  constructor (step, cause) {
    super(step)

    // maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StartupError)
    }

    // cast the error to something serializable
    this.cause = Object.keys(cause).reduce((err, key) => {
      err[key] = cause[key]
      return err
    }, {
      message: cause.message,
      stack: cause.stack,
    })
  }
}

module.exports = StartupError
