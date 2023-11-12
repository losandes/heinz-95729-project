import { test } from 'vitest'
import { limitLatency } from './limit-latency'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// not concurrent because we need to control the timing
test(['given fetch::base-fetch::limit-latency',
  'when the response completes within the max latency threshold',
  'it should produces the Response',
].join(', '), async ({ expect }) => {
  // given
  const maxLatency = 10
  const controller = new AbortController()
  const expected = { data: 'test' }
  const response = Promise.resolve(
    new Response(JSON.stringify(expected), { status: 200 }))

  // when
  const actual = await limitLatency(maxLatency, controller, response)
  await sleep(30)

  // then
  expect(await actual.json()).toStrictEqual(expected)
  expect(controller.signal.aborted).toBe(false)
})

// not concurrent because we need to control the timing
test(['given fetch::base-fetch::limit-latency',
  'when the response completes within the max latency threshold',
  'it should produces the Response',
].join(', '), async ({ expect }) => {
  // given
  const maxLatency = 10
  const controller = new AbortController()
  const expected = { data: 'test' }
  const response = new Promise<Response>((resolve, reject) => {
    sleep(30).then(() => {
      resolve(new Response(JSON.stringify(expected), { status: 200 }))
    }).catch(reject)
  })

  // when
  await limitLatency(maxLatency, controller, response)

  // then
  expect(controller.signal.aborted).toBe(true)
})
