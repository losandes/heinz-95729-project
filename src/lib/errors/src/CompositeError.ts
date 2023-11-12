type CompositeErrorOptions = {
  cause?: Readonly<Error> | undefined
}

const tryCaptureStackTrace = (error: Readonly<Error> | undefined): string => {
  try {
    return error?.stack
      ? '\nCAUSE: ' + error.stack
      : ''
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Failed to capture stack trace for', err)
    return ''
  }
}

/**
 * This subclass of Error supports chaining.
 * If available, it uses the built-in support for property `.cause`.
 * Otherwise, it sets it up itself.
 *
 * @see https://github.com/tc39/proposal-error-cause
 */
// eslint-disable-next-line functional/no-classes
export default class CompositeError extends Error {
  public readonly cause?: Error | undefined

  constructor (message: string, options?: Readonly<CompositeErrorOptions> | undefined) {
    const _message = options?.cause
      ? message + ' (CompositeError: see CAUSE for more details)'
      : message

    super(_message)

    this.cause = options?.cause
    this.stack = this.stack + tryCaptureStackTrace(this.cause)

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CompositeError.prototype)
  }
}
