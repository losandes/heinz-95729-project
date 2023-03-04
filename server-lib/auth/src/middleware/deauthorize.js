/**
 * Generates a Koa middleware that redirects the browser
 * to the given URL (e.g. the home page)
 * @param {string} redirectURL
 * @returns {IKoaRoute}
 */
export const deauthorize = (redirectURL) => async (ctx) => {
  ctx.response.body = '<html>' +
        `\n<meta http-equiv="refresh" content="0; URL=${redirectURL}">` +
        '\n<body>' +
        '\n  <h1>Success! Redirecting to the App...</h1>' +
        `\n  <button onClick="window.location = '${redirectURL}'">Click here to redirect</button>` +
      '\n</body></html>'
  ctx.response.set('Content-Type', 'text/html')
  ctx.response.status = 200
}

export default deauthorize
