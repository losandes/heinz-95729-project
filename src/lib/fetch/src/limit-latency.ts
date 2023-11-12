/**
 * Encapsulates the timeout functionality so we are less likely to
 * break this when refactoring.
 * @curried
 * @param maxLatency - the number of milliseconds to wait before aborting
 * @param controller - the AbortController to use for aborting the request
 * @returns the result of the fetch request that was passed as the final argument
 *
 * @note this assumes that the AbortController signal was passed to the
 *      fetch request as the signal option
 */
export const limitLatency = async (
  maxLatency: number,
  controller: AbortController,
  response: Promise<Response>,
) => {
  const timeout = setTimeout(() => { controller.abort() }, maxLatency)
  const res = await response
  clearTimeout(timeout)
  return res
}

export default limitLatency
