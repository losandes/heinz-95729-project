import CompositeError from './CompositeError'

type HttpErrorOptions = {
  reason?: string | undefined
  cause?: Readonly<Error> | undefined
  init?: Readonly<RequestInit> | undefined
  status?: number | undefined
  statusText?: string | undefined
  url?: string | undefined
  aborted?: boolean | undefined
}

// eslint-disable-next-line functional/no-classes
export default class HttpError extends CompositeError {
  public readonly reason: string
  public readonly aborted: boolean
  public readonly init?: RequestInit | undefined
  public readonly status?: number | undefined
  public readonly statusText?: string | undefined
  public readonly url?: string | undefined

  constructor (message: string, context?: Readonly<HttpErrorOptions> | undefined) {
    super(message, context)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    Error.captureStackTrace(this, HttpError)

    this.reason = context?.reason ?? 'uncaught_exception'
    this.aborted = context?.aborted ?? false
    this.init = context?.init
    this.status = context?.status
    this.statusText = context?.statusText
    this.url = context?.url

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, HttpError.prototype)
  }
}
