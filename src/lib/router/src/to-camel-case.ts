import { z } from 'zod'

// match leading hyphens
const LEADING_HYPHENS = /^[-_]+/
// match trailing hyphens
const TRAILING_HYPHENS = /[-_]+$/
// match the first character
const FIRST_CHAR = /^(.)/
// match characters that are preceded by a hyphen or underscore
const SUBSEQUENT_CHARS = /[-_]+([a-zA-Z0-9])/g

const toLower = (_match: string, char: string) => char.toLowerCase()
const toUpper = (_match: string, char: string) => char.toUpperCase()

/**
 * Converts a string written in kebab-case, PascalCase, or
 * snake_case to camelCase.
 */
export const toCamelCase = (input: string): string =>
  z.string().parse(input)
    .replace(LEADING_HYPHENS, '')       // remove leading hyphens
    .replace(TRAILING_HYPHENS, '')      // remove trailing hyphens
    .replace(FIRST_CHAR, toLower)       // convert first char to lowercase {
    .replace(SUBSEQUENT_CHARS, toUpper) // convert subsequent chars to uppercase

export default toCamelCase
