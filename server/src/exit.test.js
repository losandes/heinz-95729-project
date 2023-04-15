import test from 'supposed'
import expect from 'unexpected'
import exitFactory from './exit.js'

const givenExit = 'given @heinz-95729/server exit'

const time = 1680025460200
const passthrough = (/** @type {any} */ anything) => anything

// @ts-ignore
const exit = exitFactory({ exit: passthrough }).using(
  { error: passthrough },
  { now: () => time },
)

test([givenExit, 'it should write a timestamp and the error to the console'].join(', '), () => {
  const err = new Error('BOOM')
  // @ts-ignore
  // eslint-disable-next-line functional/immutable-data
  err.foo = 'bar'
  // @ts-ignore
  const [message] = exit(err)

  expect(message, 'to satisfy', {
    timestamp: 1680025460200,
    message: 'uncaught_error',
    err: {
      message: 'BOOM',
      foo: 'bar',
    },
  })
})

test([givenExit, 'it should exit the process with 1 as the code'].join(', '), () => {
  const err = new Error('BOOM')
  // @ts-ignore
  // eslint-disable-next-line functional/immutable-data
  err.foo = 'bar'
  // @ts-ignore
  // eslint-disable-next-line no-unused-vars
  const [_, code] = exit(err)

  expect(code, 'to equal', 1)
})

test([givenExit, 'when the err isn\'t an object',
  'it should write a timestamp and the error to the console'].join(', '),
() => {
  const err = 'BOOM'
  // @ts-ignore
  const [message] = exit(err)

  expect(message, 'to satisfy', {
    timestamp: 1680025460200,
    message: 'uncaught_error',
    err: 'BOOM',
  })
})
