/**
 * Joins the arguments to form a valid URL path.
 *
 * Doesn't remove the path from args that include http the way
 * `require('url').resolve` does (i.e. you can pass as many arguments as
 * you like, and your first argument may include a path)
 *
 * **Does** remove extra `/` the way `require('path').join` does!
 *
 * @param args {string[]} - the origins/paths to join (i.e. `('http://localhost:3000', 'foo/bar', 'baz')`)
 *    (it is **not** required for the first argument to include a protocol)
 * @param return {string} - the joined URL
 */
const _simpleJoin = (args: Readonly<string[]>) => {
  return args
    .filter((pathPart) => typeof pathPart === 'string' && pathPart.length > 0)
    .map((pathPart) => pathPart.replace(/(^\/|\/$)/g, ''))
    .filter((pathPart) => typeof pathPart === 'string' && pathPart.length > 0)
    .join('/')
}

/**
 * Joins the arguments to form a valid URL path.
 *
 * Doesn't remove the path from args that include http the way
 * `require('url').resolve` does (i.e. you can pass as many arguments as
 * you like, and your first argument may include a path)
 *
 * Doesn't remove extra `/` the way `require('path').join` does (i.e. you
 * can include `https://` in your first argument, and it will stay in-tact)
 *
 * @param args {...string} - the origins/paths to join (i.e. `('http://localhost:3000', 'foo/bar', 'baz')`)
 *    (it is **not** required for the first argument to include a protocol)
 * @param return {string} - the joined URL
 */
// eslint-disable-next-line functional/functional-parameters
export const join = (...args: Readonly<string[]>) => {
  if (!args.length) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('URL.join expects at least one argument')
  }

  const output = _simpleJoin(args)
  return args[0] !== undefined && args[0].startsWith('http') ? output : `/${output}`
}

export default join

export type join = typeof join
