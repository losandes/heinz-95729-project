/**
 * Route middleware to be used as an endpoint to collect
 * CSP violations from the browser.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
 * @returns {import('koa').Middleware<IKoaContextState>}
 */
export const captureCSPViolations = () => async (ctx) => {
  ctx.response.status = 204

  const logMeta = ctx.request.rawBody
    ? {
        message: 'CSP Violation: see report',
        tags: ['CSP_VIOLATION'],
        report: ctx.request.rawBody,
      }
    : {
        message: 'CSP Violation: No data received',
        tags: ['CSP_VIOLATION', 'NO_CSP_DATA'],
      }

  ctx.state.logger.emit('csp_violation', 'warn', logMeta)

  /**
   * TODO: we might want to weed out CSP violations that occur
   * when a browser navigates to our home page.
   *
   * Example report:
   * {
   *     "csp-report": {
   *         "document-uri": "http://localhost:3000/interop-apps/onedrive",
   *         "referrer": "",
   *         "violated-directive": "style-src-attr",
   *         "effective-directive": "style-src-attr",
   *         "original-policy": "default-src \'self\' \'nonce-a78275ad-ef32-48ea-bcfa-3f33f6032e1c\'; object-src \'none\'; report-uri http://localhost:3000/interop-apps/onedrive/csp-violations;",
   *         "disposition": "enforce",
   *         "blocked-uri": "inline",
   *         "line-number": 1,
   *         "source-file": "http://localhost:3000/interop-apps/onedrive",
   *         "status-code": 200,
   *         "script-sample": ""
   *     }
   * }
   */
}

export default captureCSPViolations
