type CompositeErrorOptions = {
  cause?: unknown
}

const tryCaptureStackTrace = (error: unknown): string => {
  try {
    return error instanceof Error
      ? '\nCAUSE: ' + error.stack
      : ''
  } catch (err) {
    // eslint-disable-next-line no-console
    return '\nCAUSE: Failed to capture stack trace'
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
  public readonly cause?: unknown

  constructor (message: string, options?: Readonly<CompositeErrorOptions> | undefined) {
    const _message = options?.cause
      ? message + ' (CompositeError: see CAUSE for more details)'
      : message

    super(_message)

    this.cause = options?.cause
    this.stack = options?.cause
      ? this.stack + tryCaptureStackTrace(this.cause)
      : `${this.stack}`

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CompositeError.prototype)
  }
}
