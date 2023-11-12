const EOL = /(?:\r\n|\r|\n)/g
const MULTIPLE_SPACES = /(?:\s+)/g

const _concatToOneLine = (params: Readonly<string[]>): string =>
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- why would TS not want us to guard against negative paths!?!?!?
  params.filter((v) => typeof v !== 'undefined' && v !== null && v !== '')
    .join(' ')
    .replace(EOL, ' ')
    .replace(MULTIPLE_SPACES, ' ')
    .trim()

/**
 * React's className prop only accepts a string, but we
 * often need conditional classes. This function does
 * the concatenation and removes line breaks to make
 * React happy.
 *
 * @param param0 - Array of strings (preferred) or a single
 *                 string (stop doing this)
 * @param param1 - The string to appand to param0 IFF param0 is
 *                 a string
 * @returns - all of the strings concatenated into a single line
 */
const concatToOneLine = (
  param0: Readonly<string[]> | string, param1?: string | undefined,
): string => Array.isArray(param0)
  ? _concatToOneLine(param0)
  // @ts-expect-error -- this is a valid path, but TS doesn't like it
  : _concatToOneLine([param0 as string, param1])

export default concatToOneLine
