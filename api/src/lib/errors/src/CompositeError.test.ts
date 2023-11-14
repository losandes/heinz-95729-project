import { test } from 'vitest'
import CompositeError from './CompositeError'

test(['given errors::CompositeError',
  'when an error is created with a cause',
  'it should include an indication in the message',
  'and it should include the stack of that cause',
  'and it should include the cause on the error',
].join(', '), ({ expect }) => {
  const cause = new Error('test')
  const actual = new CompositeError('test', { cause })

  // given, when, then
  expect(actual.message).toContain('(CompositeError: see CAUSE for more details)')
  expect(actual.stack).toContain('CAUSE:')
  expect(actual.cause).toStrictEqual(cause)
})
