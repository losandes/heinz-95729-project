import type { FunctionComponent } from 'react'
import { normalizePath } from './normalize-path'

type MaybePage = [
  string,
  Readonly<{ default: FunctionComponent | undefined }> | undefined
]

export type Pages = Readonly<Record< // Map<string, module>
  string,
  Readonly<{ default: FunctionComponent | undefined }>
>>

// TODO: Add support for ErrorBoundary, loaders, or actions?
export type Page = [string, Readonly<{ default: FunctionComponent }>]

/**
 * Tell the TS typesystem whether or not the page is undefined
 */
const isPage = (page: MaybePage | undefined):
  page is Page => Array.isArray(page) && typeof page[1]?.default === 'function'

/**
 * Filters out any routes that have undefined elements
 */
const filterPages = (pages: Pages): Page[] =>
  Object.keys(pages)
    .map((path: string): MaybePage => { return [path, pages[path]] })
    .filter(isPage)

/**
 * Normalizes the first element of the Page tuple (the path)
 */
const toNormalizedPage = ([_path, Element]: Readonly<Page>) =>
  [normalizePath(_path), Element] as Page

/**
 * Transforms the globbed pages to normaized paths and elements
 */
export const transformPages = (pages: Pages): Page[] =>
  filterPages(pages).map(toNormalizedPage)

export type transformPages = typeof transformPages

export default transformPages
