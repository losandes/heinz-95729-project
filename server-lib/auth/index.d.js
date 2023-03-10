/**
 * @callback IAuthenticateMiddleware
 * @param {(ctx: IKoaContext) => string} makeRedirect
 * @returns {IKoaMiddleware}
 */

/**
 * @callback IAuthorizeMiddleware
 * @param {string} redirectURL
 * @returns {IKoaMiddleware}
 */

/**
 * #IAuthModule
 * Koa middleware for authentication and authorization.
 *
 * - `authorize`: redirects the user back to the web app, which
 *    is presumable running at a different host or port
 * - `deauthorize`: redirects the user back to the web app, which
 *    is presumable running at a different host or port
 * - `login`: authenticates the user and adds a session cookie to
 *    the session
 * - `logout`: tells the browser to remove the session cookie
 * - `requireSession`: koa middleware that produces a 404 response
 *    when a request to access a protected route is made without a
 *    valid session
 * - `testSession`: koa middleware that exposes whether or not a
 *    valid session is present (e.g. so the web app can conditionally
 *    show login and logout buttons)
 * - `verifySession`: koa middleware that verifies the session and
 *    adds approprate session data to the `ctx.state`
 * - `Session`: the session object
 * @typedef {Object} IAuthModule
 * @property {IAuthorizeMiddleware} authorize
 * @property {IAuthorizeMiddleware} deauthorize
 * @property {IAuthenticateMiddleware} login
 * @property {IAuthenticateMiddleware} logout
 * @property {IKoaMiddleware} requireSession
 * @property {IKoaMiddleware} testSession
 * @property {IKoaMiddleware} verifySession
 * @property {Session} Session
 */
