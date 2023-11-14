import { test } from 'vitest'
import normalizePath from './normalize-path'

const given = 'given routing::toCamelCase'
// Case: [T: subject-under-test, string: expected result]
type Case<T> = [T, string]

test.concurrent([given,
  'when a valid file path with upper case letters in it is presented',
  'it should convert the file path to lowercase',
].join(', '), ({ expect }) => {
  const happyPaths: Case<string>[] = [
    ['a/path/WITH/[UPPERCASE]/letters', 'a/path/with/:uppercase/letters'],
  ]

  happyPaths.forEach(([sut, expected]) => {
    expect(normalizePath(sut)).toEqual(expected)
  })
})

test.concurrent([given,
  'when a valid file path with multiple variables indicated by brackets is presented',
  'it should remove the brackets and prefix the variable with `:`',
].join(', '), ({ expect }) => {
  const happyPaths: Case<string>[] = [
    ['a/path/not/[one]/but/[two]/variables', 'a/path/not/:one/but/:two/variables'],
    ['a/path/not/[one]/not/[two]/but/[three]/variables', 'a/path/not/:one/not/:two/but/:three/variables'],
  ]

  happyPaths.forEach(([sut, expected]) => {
    expect(normalizePath(sut)).toEqual(expected)
  })
})

test.concurrent([given,
  'when an invalid value is presented',
  'it should throw the expected error message',
].join(', '), ({ expect }) => {
  const negativePaths: Case<unknown>[] = [
    // ['subject-under-test', 'expected']
    [null, 'Expected string, received null'],
    [undefined, 'Required'],
    [42, 'Expected string, received number'],
  ]

  negativePaths.forEach(([sut, errMessage]) => {
    // @ts-expect-error this tests js runtime type errors
    expect(() => { return normalizePath(sut) }).toThrow(errMessage)
  })
})
