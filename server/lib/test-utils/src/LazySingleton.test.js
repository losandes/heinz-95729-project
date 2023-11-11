import { createId } from '@paralleldrive/cuid2'
import test from 'supposed'
import expect from 'unexpected'
import { LazySingleton, sleep } from '@heinz-95729/test-utils'

const makeFunc = (sleepMs = 0) => {
  // eslint-disable-next-line functional/no-let
  let called = 0

  return {
    getCount: () => called,
    func: async () => {
      called += 1
      const id = createId()

      await sleep(sleepMs)

      return { id }
    },
  }
}

test('given @heinz-95729/test-utils LazySingleton, ' +
     'when multiple callers request an instance concurrently' +
     'it should call the given func once and return the result to all callers',
async () => {
  const { func, getCount } = makeFunc()
  const { getResult } = LazySingleton(func)
  const one = await getResult()
  const two = await getResult()
  const three = await getResult()

  expect(one.id, 'to equal', two.id)
  expect(three.id, 'to equal', two.id)
  expect(getCount(), 'to equal', 1)
})

test('given @heinz-95729/test-utils LazySingleton, ' +
     'when multiple callers request an instance over time' +
     'it should call the given func once and return the result to all callers',
async () => {
  const { func, getCount } = makeFunc()
  const { getResult } = LazySingleton(func)
  const one = await getResult()
  await sleep(5)
  const two = await getResult()
  await sleep(5)
  const three = await getResult()

  expect(one.id, 'to equal', two.id)
  expect(three.id, 'to equal', two.id)
  expect(getCount(), 'to equal', 1)
})

test('given @heinz-95729/test-utils LazySingleton, ' +
     'when the func exceeds the timeout' +
     'all callers should throw',
async () => {
  const { func } = makeFunc(30)
  const { getResult } = LazySingleton(func, 5)

  expect(getResult, 'to be rejected with error satisfying',
    new Error('timeout!'))
  await sleep(5)
  expect(getResult, 'to be rejected with error satisfying',
    new Error('timeout!'))
  await sleep(30)
  expect(getResult, 'to be rejected with error satisfying',
    new Error('timeout!'))
})

test('given @heinz-95729/test-utils LazySingleton, ' +
     'when the func throws an error' +
     'all callers should throw',
async () => {
  const func = async () => { throw new Error('BOOM!') }
  const { getResult } = LazySingleton(func)

  expect(getResult, 'to be rejected with error satisfying',
    new Error('BOOM!'))
  await sleep(5)
  expect(getResult, 'to be rejected with error satisfying',
    new Error('BOOM!'))
  await sleep(30)
  expect(getResult, 'to be rejected with error satisfying',
    new Error('BOOM!'))
})

test('given @heinz-95729/test-utils LazySingleton, ' +
     'when concurrent requests are wating for the first request to complete' +
     'it should wait and try again',
async () => {
  const { func, getCount } = makeFunc(30)
  const { getResult } = LazySingleton(func)
  const one = await getResult()
  const two = await getResult(1000, 5)
  const three = await getResult(1000, 5)

  expect(one.id, 'to equal', two.id)
  expect(three.id, 'to equal', two.id)
  expect(getCount(), 'to equal', 1)
})
