import { test } from 'vitest'
import { join } from './join'

const given = 'given fetch::join'

test([given,
  'when `join` is executed with a series of paths',
  'it should join them together with a single forward slash between each',
].join(', '), ({ expect }) => {
  // console.log('join tests')
  const actual = join('a/b', '/c/d/', '/e', 'f/g', 'h')
  expect(actual).toEqual('/a/b/c/d/e/f/g/h')
})

test([given,
  'when `join` is executed and the first path includes the protocol (http)',
  'it should join them together with a single forward slash between each',
].join(', '), ({ expect }) => {
  const results = [
    ['with an ending slash', join('http://localhost:3000/', 'a/b', '/c/d/', '/e', 'f/g', 'h', 'i/j')],
    ['with no ending slash', join('http://localhost:3000', 'a/b', '/c/d/', '/e', 'f/g', 'h', 'i/j')],
    ['with an ending slash and a path', join('http://localhost:3000/a/b/', 'c/d', '/e/f/', '/g', 'h/i', 'j')],
    ['with no ending slash and a path', join('http://localhost:3000/a/b', 'c/d', '/e/f/', '/g', 'h/i', 'j')],
  ]
  results.forEach((actual) => {
    expect(actual[1], actual[0]).toEqual('http://localhost:3000/a/b/c/d/e/f/g/h/i/j')
  })
})

test([given,
  'when `join` is executed with null, undefined, or other non string arguments in the mix',
  'it should ignore the non-string values, and join them together with a single forward slash between each',
].join(', '), ({ expect }) => {
  // @ts-expect-error undefined cannot be assigned to string
  const actual = join('http://localhost:3000/a/b', undefined, null, false, true, 'c/d', '/e/f/', '/g', 'h/i', 'j')
  expect(actual).toEqual('http://localhost:3000/a/b/c/d/e/f/g/h/i/j')
})

test([given,
  'when `join` is executed using `apply`',
  'it should join them together with a single forward slash between each',
].join(', '), ({ expect }) => {
  const inputArray = ['/c/d/', '/e', 'f/g', 'h']
  // eslint-disable-next-line no-useless-call
  const actual = join.apply(null, ['https://localhost:3000', 'a/b', ...inputArray])
  expect(actual).toEqual('https://localhost:3000/a/b/c/d/e/f/g/h')
})

test([given,
  'when `join` is executed with a spread in the arguments',
  'it should join them together with a single forward slash between each',
].join(', '), ({ expect }) => {
  const inputArray = ['/c/d/', '/e', 'f/g', 'h']
  const actual = join('https://localhost:3000', 'a/b', ...inputArray)
  expect(actual).toEqual('https://localhost:3000/a/b/c/d/e/f/g/h')
})

test([given,
  'when `join` is executed with no arguments',
  'it should throw',
].join(', '), ({ expect }) => {
  expect(() => join()).toThrow('URL.join expects at least one argument')
})
