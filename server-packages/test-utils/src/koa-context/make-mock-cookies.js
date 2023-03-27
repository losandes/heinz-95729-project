/* eslint-disable functional/immutable-data */
/**
 * Creates a mock cookies object based on Koa's `cookies` interface
 * @param {any} request
 * @param {any} response
 * @param {IMap<string, string>} [cookies]
 * @param {boolean} [secure]
 * @returns {MockCookies}
 */
export function makeMockCookies (request, response, cookies = {}, secure = true) {
  /**
   * @type {Array<IMap<string, string>>}
   */
  const cookieEntries = Object.keys(cookies).map((key) =>
    [key, cookies[key]],
  )

  /** @type {any} */
  const that = { request, response, secure }

  that.requestStore = new Map(cookieEntries)
  that.responseStore = new Map(cookieEntries)

  /**
   * @param {string} name
   * @param {string | null | undefined} value
   * @param {any | undefined} opts - not used in the mock!
   * @returns {that}
   */
  that.set = (name, value, opts) => {
    that.responseStore.set(name, value)

    return that
  }

  /**
   * @param {string} name
   * @returns {any}
   */
  that.get = that.requestStore.get

  return that
}

export default makeMockCookies
