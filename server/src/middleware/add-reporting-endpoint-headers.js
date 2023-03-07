
/**
 * Sets the Reporting-Endpoints header using the given
 * report name and path. If in the future, multiple endpoints
 * are desirable to gather different security violations (e.g.
 * Content-Security-Policy and HTTP Public Key Pinning, separately),
 * consider changing this to use the Report-To header instead.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-to
 * @param {{
 *   SECURITY_VIOLATION_REPORT_NAME: string
 *   SECURITY_VIOLATION_REPORT_PATH: string
 * }} options
 * @returns {import('koa').Middleware<IKoaContextState>}
 */
export const addReportingEndpointHeaders = ({
  SECURITY_VIOLATION_REPORT_NAME,
  SECURITY_VIOLATION_REPORT_PATH,
}) => async (ctx, next) => {
  const securityViolationsReportUrl = `${ctx.state.maybeProxiedOrigin}${SECURITY_VIOLATION_REPORT_PATH}`

  ctx.set(
    'Reporting-Endpoints',
    `${SECURITY_VIOLATION_REPORT_NAME}="${securityViolationsReportUrl}"`)
  await next()
}
