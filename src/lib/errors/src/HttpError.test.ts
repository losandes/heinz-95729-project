import { test } from 'vitest'
import HttpError from './HttpError'

test(['given errors::HttpError',
  'when an error is created without a reason',
  'it should default to "uncaught_exception"',
].join(', '), ({ expect }) => {
  // given, when, then
  expect(new HttpError('test').reason).toStrictEqual('uncaught_exception')
})
