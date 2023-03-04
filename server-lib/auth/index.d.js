/**
 * @callback IMakeRedirect
 * @param {IKoaContext} ctx
 * @returns {string}
 *
 * @callback ILoginRoute
 * @param {IMakeRedirect} makeRedirect
 * @returns {IKoaRoute}
 *
 * @callback IAuthorizeRoute
 * @param {string} redirectURL
 * @returns {IKoaRoute}
 *
 * @typedef {Object} ILogin
 * @property {ILoginRoute} login
 * @property {IAuthorizeRoute} authorize
 *
 * @typedef {Object} ILogout
 * @property {ILoginRoute} logout
 * @property {IAuthorizeRoute} deauthorize
 */

/**
 * @typedef {Object} IComposedAuthModule
 * @property {ILoginRoute} login
 * @property {ILoginRoute} logout
 * @property {IAuthorizeRoute} authorize
 * @property {IAuthorizeRoute} deauthorize
 * @property {IKoaMiddleware} requireSession
 * @property {IKoaRoute} testSession
 * @property {IKoaMiddleware} verifySession
 */

/**
 * @callback IComposeAuthWithAppContext
 * @param {IAppContext} appContext
 * @returns {IComposedAuthModule}
 */

/**
 * @typedef {Object} IComposeAuth
 * @property {IComposeAuthWithAppContext} with
 */

/**
 * @typedef {Object} IAuthModule
 * @property {IComposeAuth} composeAuth
 */
