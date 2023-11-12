import { test } from 'vitest'
import transformPages, { type Page, type Pages } from './transform-pages'

const given = 'given routing::transformPages'
// Case: [T: subject-under-test, string: expected result]
type Case = [Pages, Page[]]

function TestElement () {
  return (<div>hello world!</div>)
}

test.concurrent([given,
  'when an array of valid map of <key: path, value: element> pairs is presented',
  'it should normalize the key/path for each item in the array',
].join(', '), ({ expect }) => {
  const [happyPaths, expected]: Case = [{
    companies: { default: TestElement },
    'companies/[company-id]': { default: TestElement },
    'companies/[company-id]/products': { default: TestElement },
    'companies/[company-id]/products/[product-id]': { default: TestElement },
  },
  [
    ['companies', { default: TestElement }],
    ['companies/:companyId', { default: TestElement }],
    ['companies/:companyId/products', { default: TestElement }],
    ['companies/:companyId/products/:productId', { default: TestElement }],
  ]]

  expect(transformPages(happyPaths)).toEqual(expected)
})

test.concurrent([given,
  'when an array of valid map of <key: path, value: element> pairs is presented',
  'and the TSX files do not export a default Element',
  'it should prune these paths from the output',
].join(', '), ({ expect }) => {
  const [happyPaths, expected]: Case = [{
    // @ts-expect-error this tests js runtime type errors
    'null/declaration': null,
    // @ts-expect-error this tests js runtime type errors
    'missing/declaration': undefined,
    // @ts-expect-error this tests js runtime type errors
    'null/default/declaration': { default: null },
    'missing/default/declaration': { default: undefined },
  },
  []]

  expect(transformPages(happyPaths)).toEqual(expected)
})

// TODO: log a warning when TSX files are found but they are filtered out
test.todo([`TODO: ${given}`,
  'when an array of valid map of <key: path, value: element> pairs is presented',
  'and the TSX files do not export a default function / Element',
  'it should log a warning',
].join(', '), ({ expect }) => {
  expect(false).toBeTruthy()
})
