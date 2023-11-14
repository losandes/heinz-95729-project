import { z } from 'zod'
import toCamelCase from './to-camel-case'

// match on /src/pages so it can be removed
const ROOT_FOLDER = /\.\/pages|index|\.tsx$/g
// captures all text between brackets so we can replace the opening
// bracket with a colon and remove the ending bracket
const BRACKETS = /\[(.*?)\]/g

/**
 * Converts a segment to camelCase and replace the brackets with colons
 * @param segment
 * @returns
 */
const replaceBracketsWithColon = (segment: string) =>
  segment.replace(BRACKETS, (_match, param) => `:${toCamelCase(param)}`)

/**
 * Convert params to camelCase and replace the dollars with colons
 */
const maybeNormalizeSegment = (segment: string) => segment.startsWith('[')
  ? replaceBracketsWithColon(segment)
  : segment

/**
 * Replace unused parts of the file path and params
 * Replaces kebab and snake case params with camelCase
 */
export const normalizePath = (path: string) => z.string().parse(path)
  .toLowerCase()
  .replace(ROOT_FOLDER, '')
  .split('/')
  .map(maybeNormalizeSegment)
  .join('/')

export type normalizePath = typeof normalizePath

export default normalizePath
