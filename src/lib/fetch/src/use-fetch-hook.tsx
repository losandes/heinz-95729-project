import { useCallback, useEffect, useState } from 'react'
import { z } from 'zod'
import { HttpError } from '@lib/errors'
import log from '@lib/logger'
import limitLatency from './limit-latency'

export type SettlementKey = 'not-started' | 'loading' | 'failed' | 'success'
type InitialSettlement = [undefined, false, 'not-started']
type InProcessSettlement = [undefined, true, 'loading']
type FailedSettlement = [Error | HttpError, false, 'failed']
type SuccessfulSettlement = [undefined, false, 'success']

/**
 * type: [error, loading, statusKey]
 *
 * This discriminated union of tuples is used to manage the
 * different states of a fetch request. The reason it's a
 * tuple and not an object is because we want to be able to
 * destructure multiple fetch requests in a single component
 * and this makes it easy to set custom names for each value.
 */
export type Settled = SuccessfulSettlement | InitialSettlement | InProcessSettlement | FailedSettlement

export type GlobalFetch = (
  input: Readonly<RequestInfo | URL>,
  init?: Readonly<RequestInit> | undefined,
) => Promise<Response>

const ResConverters = z.enum([
  'arrayBuffer', 'blob', 'clone', 'formData', 'json', 'text',
])
export type ResConverters = z.infer<typeof ResConverters>
export type ResolveOptions = {
  converter: Readonly<ResConverters>
  expectedResponseRange: Readonly<number[]>
}

/**
 * Executes a fetch request and validates the response. Returns a zustand
 * store with the state of the fetch request.
 *
 * This hook deals with the React 18 strict mode re-rendering so you don't
 * have to.
 * @param
 * @param schema - The schema to validate the response against
 * @param fetcher - The function that will execute the fetch request
 * @param callback - receives the validated data from the fetch request;
 *                   use this to update the state in a zustand store
 */
const useFetch = function <T> (
  url: string,
  schema: Readonly<z.ZodType<T>>,
  callback: (data: T) => void,
  { converter, expectedResponseRange }: Readonly<ResolveOptions> = {
    converter: 'json',
    expectedResponseRange: [200, 201, 204, 206],
  },
  requestInit?: Readonly<RequestInit> | undefined,
) {
  const [settlement, setSettlement] = useState<Settled>(
    [undefined, false, 'not-started'],
  )

  const _setInitialized = useCallback(() => {
    log.trace('fetch::use_fetch::initialized')
    setSettlement([undefined, false, 'not-started'])
  }, [])

  const _setStarted = useCallback(() => {
    log.trace('fetch::use_fetch::starting')
    setSettlement([undefined, true, 'loading'])
  }, [])

  const _setError = useCallback((err: Error | HttpError) => {
    // @ts-expect-error -- it doesn't matter whether this exists on Error or not
    // eslint-disable-next-line functional/no-conditional-statements
    if (!err.aborted) {
      // don't flicker error messages on the screen when a
      // request is aborted.
      log.error('fetch::use_fetch::failed', err)
      setSettlement([err, false, 'failed'])
    }
  }, [])

  const _setSuccess = useCallback((data: Readonly<T>) => {
    log.trace('fetch::use_fetch::success', data)
    setSettlement([undefined, false, 'success'])
    callback(schema.parse(data))
  // eslint-disable-next-line react-hooks/exhaustive-deps -- listening for changes to schema and callback causes an infinite loop
  }, [])

  useEffect(() => {
    try {
      _setStarted()
      const controller = new AbortController()

      ;(async () => {
        try {
          const response = await limitLatency(
            300,
            controller,
            fetch(url, requestInit),
          )
          log.trace('fetch::use_fetch::response', response)
          const isInRange = expectedResponseRange.includes(response.status)
          const reason = isInRange ? undefined : 'invalid'

          if (reason) {
            _setError(new HttpError('Fetch failed', {
              aborted: controller.signal.aborted,
              init: requestInit,
              reason,
              status: response.status,
              statusText: response.statusText,
              url,
            }))
          } else {
            _setSuccess(await response[converter]())
          }
        } catch (err) {
          _setError(new HttpError('Fetch failed', {
            aborted: controller.signal.aborted,
            cause: err as Error,
            init: requestInit,
            reason: 'uncaught_exception',
            url,
          }))
        }
      })()

      /**
       * ON COMPONENT UNMOUNT
       * Return a cleanup function to reset the
       * state of things that will be reloaded
       * on subsequent renders. Always:
       *
       * -   Abort in-flight requests
       * -   Reset the state
       */
      return () => {
        controller.abort()
        // TODO: setting intialized might cause loading symbols to flicker
        // we need to do some trial and error to figure out what the
        // intial state should be
        _setInitialized()
      }
    } catch (err: unknown) {
      _setError(err as Error | HttpError)
      /**
       * ON COMPONENT UNMOUNT
       * Return a cleanup function
       */
      return () => { /** don't initialize... the errors need to be there */ }
    }
  }, [_setError, _setInitialized, _setStarted, _setSuccess])

  return settlement
}

export default useFetch
