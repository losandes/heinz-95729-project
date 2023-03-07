import path from 'node:path'

/**
 * Generates the default Contenty-Security-Policy values
 * @param {{
 *   SECURITY_VIOLATION_REPORT_NAME: string
 *   securityViolationsReportUrl: string
 *   nonce: string
 *   enforceHttps: boolean
 * }} options
 * @returns {Object.<string, string[]>}
 */
const makeDefaultDirectives = ({
  SECURITY_VIOLATION_REPORT_NAME,
  securityViolationsReportUrl,
  nonce,
  enforceHttps,
}) => {
  /** @type {Object.<string, string[]>} */
  const directives = {
    /**
     * A fallback for the other CSP fetch directives. For each of the
     * following directives that are absent, the user agent looks for
     * the default-src directive and uses this value for it.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/default-src
     */
    'default-src': ["'self'"],
    /**
     * The base-uri directive restricts the URLs which can be used
     * in a document's <base> element. If this value is absent, then
     * any URI is allowed. If this directive is absent, the user agent
     * will use the value in the <base> element.
     *
     * Safe values include 'self' and 'none'.
     *
     * NOTE this does NOT fallback to default-src.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/base-uri
     */
    'base-uri': ["'none'"],
    /**
     * Specifies valid sources for fonts loaded using @font-face
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/font-src
     */
    'font-src': ["'self'", 'https:', 'data:'], // todo: push 'http:',
    /**
     * Restricts the URLs which can be used as the target of form
     * submissions from a given context.
     *
     * NOTE that Whether form-action should block redirects after a
     * form submission is debated and browser implementations of this
     * aspect are inconsistent (e.g. Firefox 57 doesn't block the
     * redirects whereas Chrome 63 does).
     *
     * So this setting may cause problems if you use a 3rd party, such
     * as Auth0 or OKTA for authentication.
     *
     * NOTE this does NOT fallback to default-src.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/form-action
     * @see https://github.com/w3c/webappsec-csp/issues/8
     */
    'form-action': ["'self'"],
    /**
     * Specifies valid parents that may embed a page using <frame>,
     * <iframe>, <object>, <embed>, or <applet>
     *
     * NOTE this does NOT fallback to default-src.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors
     */
    'frame-ancestors': ["'self'"],
    /**
     * Specifies valid sources of images and favicons
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/img-src
     */
    'img-src': ["'self'", 'data:'],
    /**
     * Specifies valid sources for the <object>, <embed>, and <applet>
     * elements.
     *
     * NOTE Elements controlled by object-src are perhaps coincidentally
     * considered legacy HTML elements and aren't receiving new
     * standardized features (such as the security attributes sandbox or
     * allow for <iframe>). Therefore it is recommended to restrict this
     * fetch-directive (e.g. explicitly set object-src 'none' if possible).
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/object-src
     */
    'object-src': ["'none'"],
    /**
     * Specifies valid sources for JavaScript. This includes not only
     * URLs loaded directly into <script> elements, but also things
     * like inline script event handlers (onclick) and XSLT stylesheets
     * which can trigger script execution.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src
     */
    'script-src': ["'strict-dynamic'", `'nonce-${nonce}'`, "'unsafe-inline'", 'https:'], // todo: push 'http:',
    /**
     * Instructs user agents to control the data passed to DOM XSS
     * sink functions, like Element.innerHTML setter.
     *
     * When used, those functions only accept non-spoofable, typed
     * values created by Trusted Type policies, and reject strings.
     * Together with trusted-types directive, which guards creation
     * of Trusted Type policies, this allows authors to define rules
     * guarding writing values to the DOM and thus reducing the DOM
     * XSS attack surface to small, isolated parts of the web
     * application codebase, facilitating their monitoring and code
     * review.
     *
     * NOTE that this is not widely supported yet (as of 2023-03-07)
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/require-trusted-types-for
     */
    'require-trusted-types-for': ["'script'"],
    /**
     * Specifies valid sources for JavaScript inline event handlers.
     *
     * This directive only specifies valid sources for inline script
     * event handlers like onclick. It does not apply to other JavaScript
     * sources that can trigger script execution, such as URLs loaded
     * directly into <script> elements and XSLT stylesheets. (Valid
     * sources can be specified for all JavaScript script sources using
     * script-src, or just for <script> elements using script-src-elem.)
     *
     * NOTE this is not yet supported in Safari (as of 2023-03-07)
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src-attr
     */
    'script-src-attr': ["'none'"],
    /**
     * Specifies valid sources for stylesheets.
     *
     * It also supports an option to have inline styles, which is
     * denied by default
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/style-src
     */
    'style-src': ["'self'"],
    /**
     * Instructs the user agent to report attempts to violate the
     * Content Security Policy. These violation reports consist of
     * JSON documents sent via an HTTP POST request to the specified URI.
     *
     * NOTE that this is deprecated, however the Report-To header which
     * replaces this is not widespread yet, so this should remain for
     * backward compatibility until it's safe to remove it.
     * @deprecated
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-uri
     */
    'report-uri': [securityViolationsReportUrl],
    /**
     * Instructs the user agent to store reporting endpoints for an origin.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-to
     */
    'report-to': [typeof SECURITY_VIOLATION_REPORT_NAME === 'string'
      ? SECURITY_VIOLATION_REPORT_NAME
      : 'security-violation-endpoint'],
  }

  if (enforceHttps) {
    /**
    * Instructs user agents to treat all of a site's insecure URLs
    * (those served over HTTP) as though they have been replaced
    * with secure URLs (those served over HTTPS). This directive
    * is intended for web sites with large numbers of insecure
    * legacy URLs that need to be rewritten.
    * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/upgrade-insecure-requests
    */
    directives['upgrade-insecure-requests'] = []
  }

  return directives
}

/**
 * Generates the Contenty-Security-Policy value
 * @param {{
 *   SECURITY_VIOLATION_REPORT_NAME: string
 *   securityViolationsReportUrl: string
 *   nonce: string
 *   directives?: Object.<string, string[] | boolean>
 *   isGraphiQL: boolean
 *   enforceHttps: boolean
 * }} options
 * @returns {string[]}
 */
const makeDirectives = (options) => {
  const { isGraphiQL } = options
  const defaultDirectives = makeDefaultDirectives(options)

  if (isGraphiQL) {
    /**
     * GraphiQL loads a favicon from Github, so we conditionally allow
     * that on the 'img-src' directive when the route is GraphiQL.
     */
    defaultDirectives['img-src'].push('https://raw.githubusercontent.com')

    /**
     * GraphiQL loads CSS from a CDN, so we conditionally allow
     * that on the 'style-src' directive when the route is GraphiQL.
     *
     * This conditional directive assumes that GraphiQL and
     * introspection are enabled/disabled using equivalent logic
     * to `isGraphiQL`
     */
    defaultDirectives['style-src'].push("'unsafe-inline'")
    defaultDirectives['style-src'].push('https://unpkg.com')

    /**
     * GraphiQL loads JavaScript from a CDN, so we conditionally allow
     * that on the 'script-src' directive when the route is GraphiQL.
     *
     * We also don't control the markup, so we can't add nonces, so
     * this directive is overriden instead of extended.
     *
     * This conditional directive assumes that GraphiQL and
     * introspection are enabled/disabled using equivalent logic
     * to `isGraphiQL`
     */
    defaultDirectives['script-src'] = ['self', "'unsafe-inline'", 'https:', 'https://unpkg.com']
  }

  const directives = { ...defaultDirectives, ...options.directives }
  return Object.keys(directives).reduce(
    (/** @type {string[]} */ output, key) => {
      if (directives[key] === false) {
        // do nothing - the caller is removing a defaultDirective
      } else if (
        Array.isArray(directives[key]) &&
        /** @type {string[]} */ (directives[key]).length === 0
      ) {
        output.push(key)
      } else if (Array.isArray(directives[key])) {
        output.push(`${key} ${/** @type {string[]} */ (directives[key]).join(' ')}`)
      } else {
        throw new Error(`Expected the directive to either be an empty array, an array of strings, or a boolean, but got {${typeof directives[key]}}`)
      }

      return output
    }, [])
}

/**
 * @param {{
 *   ctx: IKoaContext
 *   prefix?: string
 * }} options
 */
const isGraphiQL = ({ ctx, prefix }) =>
  ctx.state.env.ALLOW_DEV_CONFIGURATIONS &&
  ctx.request.method === 'GET' && (
    ctx.request.path.startsWith('/graphql') ||
    (
      typeof prefix === 'string' &&
      ctx.request.path.startsWith(path.join(prefix, 'graphql'))
    )
  )

/**
 * Adds a Content-Security-Policy to the request headers
 *
 * Note that when this middleware is used, all script tags need to
 * be implemented with a nonce. The `ctx.state.affinityId` is used
 * for the nonce
 *
 * e.g. <script nonce="${ctx.state.affinityId}">console.log(1 + 1)</script>
 *
 * If your app uses inline styles, such as <style> elements or
 * style attributes, you should override the styles directive with:
 *
 * generateCsp({
 *   router,
 *   cspViolationsReportPath: '/csp-violations',
 *   directives: {
 *     'style-src': ["'self'", "'unsafe-inline'", 'http:', 'https:']
 *   },
 * })
 *
 * @see https://csp-evaluator.withgoogle.com/
 * @see https://helmetjs.github.io/docs
 * @param {{
 *   directives?: Object.<string, string[]>
 *   prefix?: string
 *   SECURITY_VIOLATION_REPORT_NAME: string
 *   SECURITY_VIOLATION_REPORT_PATH: string
 * }} options
 * @returns {import('koa').Middleware<IKoaContextState>}
 */
export const setCsp = ({
  directives,
  prefix,
  SECURITY_VIOLATION_REPORT_NAME,
  SECURITY_VIOLATION_REPORT_PATH,
}) => async (ctx, next) => {
  const securityViolationsReportUrl = `${ctx.state.maybeProxiedOrigin}${SECURITY_VIOLATION_REPORT_PATH}`
  const policy = makeDirectives({
    directives,
    enforceHttps: ctx.state.env.ENFORCE_HTTPS,
    isGraphiQL: isGraphiQL({ ctx, prefix }),
    nonce: ctx.state.affinityId,
    securityViolationsReportUrl,
    SECURITY_VIOLATION_REPORT_NAME,
  }).join(';')

  ctx.set('Content-Security-Policy', policy)
  await next()
}

export default setCsp

export const forTesting = { makeDefaultDirectives, makeDirectives, isGraphiQL }
